import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UtilitiesService } from '../../services/utilities.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexPlotOptions,
  ApexLegend,
  NgApexchartsModule,
  ChartComponent,
  ApexResponsive,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public trendCOpt: Partial<ChartOptions>;
  public locationCOpt: Partial<ChartOptions>;
  public trainerCOpt: Partial<ChartOptions>;
  constructor(private Utils: UtilitiesService) {
    this.locationCOpt = {
      series: [
        {
          data: [
            {
              x: 'Karachi',
              y: 218,
            },
            {
              x: 'Islamaba',
              y: 149,
            },
            {
              x: 'Sawan',
              y: 184,
            },
            {
              x: 'Naimat',
              y: 55,
            },
            {
              x: 'Meher',
              y: 84,
            },
            {
              x: 'Khaskheli',
              y: 31,
            },
            {
              x: 'Kadanwari',
              y: 70,
            },
            {
              x: 'Dhabi',
              y: 30,
            },
            {
              x: 'Kausar',
              y: 44,
            },
            {
              x: 'Matli',
              y: 68,
            },
            {
              x: 'Tando Adam',
              y: 28,
            },
          ],
        },
      ],
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
      },
      title: {
        text: 'Locations',
        align: 'center',
      },
      colors: [
        '#3B93A5',
        '#F7B844',
        '#ADD8C7',
        '#EC3C65',
        '#CDD7B6',
        '#C1F666',
        '#D43F97',
        '#1E5D8C',
        '#421243',
        '#7F94B0',
        '#EF6537',
        '#C0ADDB',
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    };
    this.trendCOpt = {
      series: [
        {
          name: 'Revenue',
          data: [45000, 56000, 62000, 70000, 75000, 78000],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June'],
      },
      yaxis: {
        title: {
          text: 'Revenue (USD)',
        },
      },
      title: {
        text: 'Monthly Revenue Trend',
        align: 'left',
      },
      colors: ['#008FFB'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        type: 'solid',
      },
    };
    this.trainerCOpt = {
      series1: [44, 55, 13],
      chart: {
        type: 'pie',
      },
      labels: ['JBL', 'MH', 'MZ'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'top',
            },
          },
        },
      ],
    };
  }

  ngOnInit() {
    this.Utils.setTitle('Dashboard');
  }

  public generateData(count: number, yrange: { max: number; min: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = 'w' + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  }
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  series1: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  colors: string[];
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  labels: any;
};
