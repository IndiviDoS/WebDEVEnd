// src/app/components/order-history/order-history.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryComponent } from './order-history.component';
import { OrderService } from '../../service/order.service'; // Would likely be imported
import { of } from 'rxjs'; // Needed for mocking service

// Mock the service with just the method the basic test might use
class MockOrderService {
  getOrderHistory() {
    return of([]); // Return an observable of an empty array
  }
}


describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderHistoryComponent ],
      // Provide the mock service
      providers: [
        { provide: OrderService, useClass: MockOrderService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Basic test to check if the component is created
  });

  // There might be one or two more basic tests automatically generated
  // e.g., testing if ngOnInit was called
});