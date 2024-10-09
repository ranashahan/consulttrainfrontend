import { apiAssessmentModel } from './Assessment';

export interface apiCategoryModel {
  id: number;
  name: string;
  initials: string;
  assessments: apiAssessmentModel[];
}
