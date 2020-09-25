import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamPage } from './exam.page';

describe('ExamPage', () => {
  let component: ExamPage;
  let fixture: ComponentFixture<ExamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
