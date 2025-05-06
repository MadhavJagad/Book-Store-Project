import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPageComponent } from './password-page.component';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
