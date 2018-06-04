import { Exercise } from "./exercixe.model";

export class TrainingService {
    availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 10},
        { id: 'side-lunges', name: 'side-lunges', duration: 30, calories: 8},
        { id: 'burbees', name: 'Burbees', duration: 30, calories: 8}
    ]
}