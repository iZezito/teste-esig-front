import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import {TarefaService, Tarefa} from '../tarefa.service';

@Component({
  selector: 'app-create-tarefa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    MessageModule,
    RouterLink
  ],
  templateUrl: './create-tarefa.component.html',
  styleUrl: './create-tarefa.component.css'
})
export class CreateTarefaComponent {
  tarefaForm: FormGroup;
  isEditMode = false;
  tarefaId: number | null = null;
  isLoading = false;
  responsaveis = [
    { label: 'João', value: 'João' },
    { label: 'Bruno', value: 'Bruno' },
    { label: 'Antônio', value: 'Antônio' },
    { label: 'Rodrigo', value: 'Rodrigo' },

  ];
  prioridades = [
    { label: 'Alta', value: 'ALTA' },
    { label: 'Média', value: 'MEDIA' },
    { label: 'Baixa', value: 'BAIXA' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TarefaService
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      responsavel: ['', Validators.required],
      prioridade: ['', Validators.required],
      deadline: ['', Validators.required],
      situacao: ['EM_ANDAMENTO']
    });
  }

  ngOnInit() {
    this.tarefaId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.tarefaId;
    if (this.isEditMode) {
      this.loadTask();
    }
  }

  loadTask() {
    if (this.tarefaId) {
      this.isLoading = true;
      this.taskService.getTarefa(this.tarefaId).subscribe({
        next: (task) => {
          this.tarefaForm.patchValue({
            ...task,
            deadline: new Date(task.deadline)
          });
          this.isLoading = false;
        },
        error: () => (this.isLoading = false)
      });
    }
  }

  onSubmit() {
    if (this.tarefaForm.valid) {
      this.isLoading = true;
      const task: Tarefa = {
        ...this.tarefaForm.value,

        deadline: this.tarefaForm.value.deadline.toISOString()
      };

      const request = this.isEditMode && this.tarefaId
        ? this.taskService.updateTarefa(this.tarefaId, task)
        : this.taskService.createTarefa(task);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/tarefas']);
        },
        error: () => (this.isLoading = false)
      });
    }
  }

  isFormEmpty(): boolean {
    const values = this.tarefaForm.value;
    return !values.titulo && !values.descricao && !values.responsavel && !values.prioridade && !values.deadline;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.tarefaForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
