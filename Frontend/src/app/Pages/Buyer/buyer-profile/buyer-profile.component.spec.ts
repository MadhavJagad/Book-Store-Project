import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProfileComponent } from './buyer-profile.component';

describe('BuyerProfileComponent', () => {
  let component: BuyerProfileComponent;
  let fixture: ComponentFixture<BuyerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
