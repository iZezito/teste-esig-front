import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {TarefaService, Tarefa, TarefaFilters} from '../tarefa.service';
import {MessageService} from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-list-tarefa',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    MessageModule,
    ToastModule,
    RouterLink,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-tarefa.component.html',
  styleUrl: './list-tarefa.component.css'
})
export class ListTarefaComponent implements OnInit{

  tasks: Tarefa[] = [];
  filterNumero: number | null = null;
  filterTitulo: string | null = null;
  filterResponsavel: string | null = null;
  filterSituacao: 'EM_ANDAMENTO' | 'CONCLUIDA' | null = null;
  responsaveis: { label: string, value: string }[] = [
    { label: 'João', value: 'João' },
    { label: 'Bruno', value: 'Bruno' },
    { label: 'Antônio', value: 'Antônio' },
    { label: 'Rodrigo', value: 'Rodrigo' },

  ];
  situacoes = [
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluída', value: 'CONCLUIDA' }
  ];

  constructor(
    private taskService: TarefaService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filterNumero = params['numero'] ? Number(params['numero']) : null;
      this.filterTitulo = params['titulo'] || null;
      this.filterResponsavel = params['responsavel'] || null;
      this.filterSituacao = params['situacao'] as 'EM_ANDAMENTO' | 'CONCLUIDA' | null || null;
      this.loadTasks();
    });
  }

  loadTasks() {
    const params: TarefaFilters = {};
    if (this.filterNumero) params.numero = this.filterNumero;
    if (this.filterTitulo) params.titulo = this.filterTitulo;
    if (this.filterResponsavel) params.responsavel = this.filterResponsavel;
    if (this.filterSituacao) params.situacao = this.filterSituacao;

    this.taskService.getTarefas(params).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }
    });
  }

  applyFilters() {
    const queryParams: TarefaFilters = {};
    if (this.filterNumero) queryParams.numero = this.filterNumero;
    if (this.filterTitulo) queryParams.titulo = this.filterTitulo;
    if (this.filterResponsavel) queryParams.responsavel = this.filterResponsavel;
    if (this.filterSituacao) queryParams.situacao = this.filterSituacao;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.loadTasks();
  }

  clearFilters() {
    this.filterNumero = null;
    this.filterTitulo = null;
    this.filterResponsavel = null;
    this.filterSituacao = null;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: '',
    });

    this.loadTasks();
  }


  deleteTask(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja excluir esta tarefa?',
      header: 'Confirmação de Exclusão',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.taskService.deleteTarefa(id).subscribe({
          next: () => {
            this.loadTasks();
            this.messageService.add({
              severity: 'success',
              summary: 'Tarefa excluída com sucesso!'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro ao excluir tarefa'
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Exclusão cancelada'
        });
      }
    });
  }

  completeTask(id: number) {
    this.taskService.completarTarefa(id).subscribe({
      next: () => {
        this.loadTasks()
        this.messageService.add({
          severity: 'success',
          summary: 'Tarefa foi concluída!',
        });
      }
    });
  }

}
