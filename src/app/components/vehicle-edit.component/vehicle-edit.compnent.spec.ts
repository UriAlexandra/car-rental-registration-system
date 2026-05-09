import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { VehicleEditComponent } from './vehicle-edit.component';
import { VehicleService } from '../../services/vehicle-service/vehicle.service';
import { UserService } from '../../services/user-service/user.service';

describe('VehicleEditComponent', () => {
  let component: VehicleEditComponent;
  let fixture: ComponentFixture<VehicleEditComponent>;

  beforeEach(async () => {
    const mockVehicleService = {
      getVehicle: jasmine.createSpy('getVehicle').and.returnValue(of({})),
      updateVehicle: jasmine.createSpy('updateVehicle').and.returnValue(of({}))
    };

    const mockUserService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        VehicleEditComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});