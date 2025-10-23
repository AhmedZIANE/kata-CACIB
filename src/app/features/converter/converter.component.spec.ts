import { ComponentFixture, TestBed } from '@angular/core/testing';

import { converterComponent } from './converter.component';

describe('LayoutComponent', () => {
  let component: converterComponent;
  let fixture: ComponentFixture<converterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [converterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(converterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
