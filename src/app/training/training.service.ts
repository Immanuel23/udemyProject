import { Exercise } from "./exercixe.model";
import { Subject } from 'rxjs/Subject'
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Subscription } from 'rxjs'
import { UIService } from "../shared/ui.service";
 
@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>()
    exercisesChanged = new Subject<Exercise[]>()
    finishedExChanged = new Subject<Exercise[]>()

   private availableExercises: Exercise[] = []
    private runningExercise: Exercise;
    private exercises: Exercise[] = []
    private fbSubs: Subscription[] = []

    constructor(private db: AngularFirestore, private uiService: UIService){
        db.firestore.settings({ timestampsInSnapshots: true })
    }


    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true)
       this.fbSubs.push(this.db.collection('AvailableExercises')
       .snapshotChanges()
       .map(doc_data => {
         return doc_data.map((doc)=>{ 
           return {
           id: doc.payload.doc.id,
           name: doc.payload.doc.data().name,
           duration: doc.payload.doc.data().duration,
           calories: doc.payload.doc.data().calories
         }})
       })
       .subscribe((exercises: Exercise[])=>{
        this.uiService.loadingStateChanged.next(false)
           this.availableExercises = exercises;
           this.exercisesChanged.next([...this.availableExercises])
       }, 
       error =>{
           this.uiService.loadingStateChanged.next(false);
           this.uiService.showSnackBar('Fetching exercises failed, please try again later', null, 3000),
           this.exercisesChanged.next(null)

       })) 
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)
        this.exerciseChanged.next({...this.runningExercise})
        
    }

    completeExercise(){
        this.addDataTodatabase({...this.runningExercise, date: new Date(), state: 'completed'})
        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }
    cancelExercise(progress: number) {
        this.addDataTodatabase(
            {...this.runningExercise,
                duration: this.runningExercise.duration * (progress/100),
                calories:this.runningExercise.calories * (progress/100), 
                date: new Date(), 
                state: 'cancelled'})

        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }

    getRunningExercise() {
        return {...this.runningExercise}
    }

    fetchCompletedOrCancelledExercises(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges()
        .subscribe((exercises: Exercise[]) => {
            this.finishedExChanged.next(exercises)
        }, error =>{
        console.log(error)
        }))
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe())
    }

    private addDataTodatabase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise)
    }
}