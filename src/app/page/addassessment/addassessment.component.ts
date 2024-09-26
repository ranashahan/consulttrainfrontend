import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DriversearchComponent } from '../../widget/driversearch/driversearch.component';
declare var bootstrap: any;
@Component({
  selector: 'app-addassessment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DriversearchComponent],
  templateUrl: './addassessment.component.html',
  styleUrl: './addassessment.component.css',
})
export class AddassessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  @ViewChild(DriversearchComponent)
  driverSearchComponent!: DriversearchComponent;

  categories = [
    {
      name: 'Basic Driving Skills',
      selected: false,
      assessments: [
        {
          name: 'Seat and head restraint correctly positioned',
          scoreInitial: null,
          scoreFinal: null,
        },
        {
          name: 'All mirrors adjusted from driving position - before driving off',
          scoreInitial: null,
          scoreFinal: null,
        },
        // Add other assessment items for this category
      ],
    },
    {
      name: 'Mountain / Desert Driving',
      selected: false,
      assessments: [
        {
          name: 'Use of 4WD / Power Divider',
          scoreInitial: null,
          scoreFinal: null,
        },
        { name: 'Control of speed', scoreInitial: null, scoreFinal: null },
        // Add other assessment items for this category
      ],
    },
    {
      name: 'Maneuvering Assessment',
      selected: false,
      assessments: [
        { name: 'Parallel Parking', scoreInitial: null, scoreFinal: null },
        { name: 'Perpendicular Parking', scoreInitial: null, scoreFinal: null },
        // Add other assessment items for this category
      ],
    },
  ];

  constructor(private fb: FormBuilder) {
    this.assessmentForm = this.fb.group({
      driverId: [''], // Will hold the selected driver ID
    });
  }
  ngOnInit(): void {
    this.assessmentForm = this.fb.group({
      driverId: [''],
      categories: this.fb.array(
        this.categories.map((category) =>
          this.fb.group({
            selected: [false],
            assessments: this.fb.array(
              // Ensure the 'assessments' FormArray is initialized
              category.assessments.map((assessment) =>
                this.fb.group({
                  name: [assessment.name],
                  scoreInitial: [null],
                  scoreFinal: [null],
                })
              )
            ),
          })
        )
      ),
    });
  }

  createCategoryForm(category: any): FormGroup {
    return this.fb.group({
      selected: [category.selected],
      assessments: this.fb.array(
        category.assessments.map((assessment: any) =>
          this.createAssessmentForm(assessment)
        )
      ),
    });
  }

  getAssessments(category: AbstractControl) {
    return category.get('assessments') as FormArray;
  }
  createAssessmentForm(assessment: any): FormGroup {
    return this.fb.group({
      name: [assessment.name],
      scoreInitial: [assessment.scoreInitial],
      scoreFinal: [assessment.scoreFinal],
    });
  }

  get categoriesArray(): FormArray {
    return this.assessmentForm.get('categories') as FormArray;
  }

  toggleCategory(index: number): void {
    const categoryControl = this.categoriesArray.at(index) as FormGroup;
    const selected = categoryControl.get('selected')?.value;
    console.log(`Category at index ${index} selected: ${selected}`);
  }

  // Open the search modal
  openSearchModal() {
    this.driverSearchComponent.openModal(); // Call method to show the modal
  }

  // Capture the selected driver ID
  onDriverSelected(driverId: number) {
    this.assessmentForm.patchValue({ driverId });
  }
}
