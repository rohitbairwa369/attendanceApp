import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export abstract class unsub implements OnDestroy{

    onDestroyed$ = new Subject<boolean>()

    
    ngOnDestroy(): void {
        this.onDestroyed$.next(true)
        this.onDestroyed$.complete()
    }
    
}