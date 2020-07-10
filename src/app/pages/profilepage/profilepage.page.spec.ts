import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfilepagePage } from './profilepage.page';

describe('ProfilepagePage', () => {
  let component: ProfilepagePage;
  let fixture: ComponentFixture<ProfilepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilepagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
