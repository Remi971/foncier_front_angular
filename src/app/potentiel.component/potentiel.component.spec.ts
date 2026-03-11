import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentielComponent } from './potentiel.component';

describe('PotentielComponent', () => {
  let component: PotentielComponent;
  let fixture: ComponentFixture<PotentielComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotentielComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotentielComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
