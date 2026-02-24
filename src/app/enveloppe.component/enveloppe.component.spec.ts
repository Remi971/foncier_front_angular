import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnveloppeComponent } from './enveloppe.component';

describe('EnveloppeComponent', () => {
  let component: EnveloppeComponent;
  let fixture: ComponentFixture<EnveloppeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnveloppeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnveloppeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
