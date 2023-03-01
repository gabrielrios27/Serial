import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNewListComponent } from './my-new-list.component';

describe('MyNewListComponent', () => {
  let component: MyNewListComponent;
  let fixture: ComponentFixture<MyNewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNewListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
