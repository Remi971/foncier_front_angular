import { Component, effect, inject, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MapAction } from '../dto/mapAction.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartoApiService } from '../../services/cartoapi.service';
import { ProcessSchemaDto, ProcessType } from '../dto/process.dto';

@Component({
  selector: 'app-enveloppe.component',
  imports: [ReactiveFormsModule],
  templateUrl: './enveloppe.component.html',
  styleUrl: './enveloppe.component.css',
})
export class EnveloppeComponent implements OnInit {
  mapService = inject(MapService)
  cartoApi = inject(CartoApiService)
  editEnveloppeActive: boolean = false;
  enveloppeForm!: FormGroup
  formBuilder = inject(FormBuilder)

  constructor() {
    // By default, we want to display the enveloppe if it exists on the map when the component is loaded
    this.mapService.requestAction(MapAction.GET_ENVELOPPE)

    effect(() => {
      if (this.mapService.communeSaved()) {
        this.mapService.requestAction(MapAction.GET_ENVELOPPE)
      }
    })
  }

  ngOnInit(): void {
    this.enveloppeForm = this.formBuilder.group({
      minSurfBati: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
      bufferBati: [4, [Validators.required, Validators.min(0), Validators.max(50)]],
      dilatation: [50, [Validators.required, Validators.min(1), Validators.max(100)]],
      erosion: [-30, [Validators.required, Validators.min(-100), Validators.max(-1)]],
      minPartInBuffer: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      maxSurfTrou: [2000, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      minSurfEnv: [30000, [Validators.required, Validators.min(10000), Validators.max(100000)]],
      maxSurfResidus: [5, [Validators.required, Validators.min(0), Validators.max(1000)]]
    })
  }

  removeEnveloppe(): void {
    this.mapService.requestAction(MapAction.REMOVE_ENVELOPPE);
  }

  addEnveloppe(): void {
    this.mapService.requestAction(MapAction.GET_ENVELOPPE);
  }

  editEnveloppe(): void {
    this.editEnveloppeActive = true
    this.mapService.requestAction(MapAction.EDIT_ENVELOPPE);
  }

  saveEnveloppe(): void {
    this.editEnveloppeActive = false;
    this.mapService.requestAction(MapAction.SAVE_ENVELOPPE)
  }

  cancelEditEnveloppe(): void {
    this.editEnveloppeActive = false;
    this.mapService.requestAction(MapAction.CANCEL_EDIT_ENVELOPPE)
  }

  calculateEnveloppe(): void {
    if (this.enveloppeForm.valid) {
      if (this.mapService.isEnveloppe()) {
        const validate = confirm("Êtes vous sûr de remplacer l'enveloppe?") 
        if (!validate) {
          return
        }
      }
      const closeModal = document.getElementById("closeModal");
      closeModal?.click();
      const formValues = this.enveloppeForm.value;
      console.log("Calculating enveloppe with parameters: ", formValues);
      const body : ProcessSchemaDto = {
        type: ProcessType.ENVELOPPE_GENERATION,
        parameters: {...formValues, ...this.mapService.communeSaved()}
       }
       console.log("Request body for orchestrate API call: ", body);
       this.cartoApi.orchestrate(body).subscribe({
        next: () => this.mapService.processing.set(true),
        error: (error) => {
          console.error("Error while calling orchestrate API: ", error);
          this.mapService.processing.set(false);
          alert("Une erreur est survenue lors du lancement du calcul de l'enveloppe. Veuillez réessayer.")
        },
        complete: () => console.log("Orchestrate API call completed")
       })
      }
      else {
        console.error("Enveloppe form is invalid: ", this.enveloppeForm.value);
        console.error("Form errors: ", this.enveloppeForm.errors);
        alert("Veuillez remplir tous les champs du formulaire.");
      }
  }

  downloadEnveloppe(): void {
    alert("Not implemented yet!")
  }
}
