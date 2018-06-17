import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercixe.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../../shared/ui.service';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  constructor(private trainingService: TrainingService, private uiService: UIService) {
  
   }
  exercises: Exercise[]
  private exerciseSubscription: Subscription;
  private loadingSubs: Subscription;

  isLoading = true;

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading
      }
    )
    this. exerciseSubscription = this.trainingService.exercisesChanged
    .subscribe(exercises => {
      this.exercises = exercises
    })

    
    this.fetchExercises()
    
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises()

  }
  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe()
    this.loadingSubs.unsubscribe()
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }

}
