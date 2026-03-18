import { Component, inject, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-potentiel.component',
  imports: [ReactiveFormsModule],
  templateUrl: './potentiel.component.html',
  styleUrl: './potentiel.component.css',
})
export class PotentielComponent implements OnInit {
  mapService = inject(MapService);
  formBuilder = inject(FormBuilder);
  potentielForm!: FormGroup


  ngOnInit(): void {
    this.potentielForm = this.formBuilder.group({
      minSurfParNue: [400, [Validators.required, Validators.min(0), Validators.max(5000)]],
      minSurfParBatie: [1000, [Validators.required, Validators.min(0), Validators.max(5000)]],
      maxCes: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      minSurfDivision: [400, [Validators.required, Validators.min(0), Validators.max(2000)]],
      distBufferTest: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
      distBufferBati: [8, [Validators.required, Validators.min(0), Validators.max(100)]]
    })
  }


}
