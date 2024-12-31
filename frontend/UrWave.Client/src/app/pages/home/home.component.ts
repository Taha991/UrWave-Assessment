import { Component } from '@angular/core';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { DashboardComponent } from "../../components/dashboard/dashboard.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StatisticsComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
