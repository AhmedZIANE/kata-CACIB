import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { converterComponent } from "./features/converter/converter.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, converterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kata-CACIB';
}
