import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ConversionHistory } from '../../model/conversion-history';

@Component({
  selector: 'app-converter',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class converterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private sub?: Subscription;
  // Taux de change dynamique
  realRate = signal(1.1); // valeur initiale
  fixedRate = signal<number | null>(null); // taux fixe optionnel


  form = this.fb.group({
    amount: [100, [Validators.required, Validators.min(0)]],
    mode: ['EUR', Validators.required], // "EUR" => saisie en euros, sinon "USD"
    customRate: [null as number | null]
  });

  // Historique des conversions
  history = signal<ConversionHistory[]>([]);

  constructor() {
    this.startRateSimulation();
  }

  // Simulation du taux de change
  private startRateSimulation() {
    this.sub = interval(3000).subscribe(() => {
      const variation = (Math.random() * 0.1 - 0.05); // -0.05 → +0.05
      const newRate = +(this.realRate() + variation).toFixed(4);
      this.realRate.set(Math.max(0.5, newRate)); // sécurité minimale

      this.checkFixedRate();
    });
  }

  // Vérifie si le taux fixe doit être désactivé
  private checkFixedRate() {
    const fixed = this.fixedRate();
    if (fixed !== null) {
      const real = this.realRate();
      const diffPercent = Math.abs((fixed - real) / real) * 100;
      if (diffPercent > 2) {
        console.warn('Taux fixe désactivé : écart > 2%');
        this.fixedRate.set(null);
        this.form.patchValue({ customRate: null });
      }
    }
  }

  // Calcul de conversion dynamique
  converted = computed(() => {
    const { amount, mode } = this.form.value;
    if (!amount) return null;

    const rate = this.fixedRate() ?? this.realRate();

    let result = 0;
    if (mode === 'EUR') result = amount * rate;
    else result = amount / rate;

    return +result.toFixed(2);
  });

  // Permet de forcer un taux fixe
  setFixedRate() {
    const val = this.form.get('customRate')?.value;
    if (val && val > 0) {
      this.fixedRate.set(+val);
    }
  }

  // Effectuer une conversion et l’ajouter à l’historique
  convert() {
    const { amount, mode } = this.form.value;
    if (!amount) return;

    const realRate = this.realRate();
    const fixedRate = this.fixedRate();
    const rateUsed = fixedRate ?? realRate;
    const output = this.converted();

    if (output === null) return;

    const record: ConversionHistory = {
      realRate,
      fixedRate,
      inputValue: amount,
      inputCurrency: mode as 'EUR' | 'USD',
      outputValue: output,
      outputCurrency: mode === 'EUR' ? 'USD' : 'EUR'
    };

    const updated = [record, ...this.history()].slice(0, 5);
    this.history.set(updated);
  }

  // --- Inverse le mode ---
  switchMode() {
    const { amount, mode } = this.form.value;
    const currentConverted = this.converted();
    if (currentConverted === null) return;

    this.form.patchValue({
      mode: mode === 'EUR' ? 'USD' : 'EUR',
      amount: currentConverted
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
