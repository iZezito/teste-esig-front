import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: 'alta' | 'media' | 'baixa';
  deadline: string;
  situacao?: 'EM_ANDAMENTO' | 'CONCLUIDA';
}

export interface TarefaFilters {
  numero?: number;
  titulo?: string;
  responsavel?: string;
  situacao?: 'EM_ANDAMENTO' | 'CONCLUIDA';
}

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly API_URL = 'http://localhost:8080/tarefas';

  constructor(private http: HttpClient) {}

  getTarefas(filters: TarefaFilters): Observable<Tarefa[]> {
    let params = new HttpParams();
    if (filters.responsavel) params = params.set('responsavel', filters.responsavel);
    if (filters.situacao) params = params.set('situacao', filters.situacao);
    if (filters.numero) params = params.set('numero', filters.numero)
    if (filters.titulo) params = params.set('titulo', filters.titulo)

    return this.http.get<Tarefa[]>(this.API_URL, {params});
  }

  getTarefa(id: number): Observable<Tarefa> {
    console.log('id buscado: ', id);
    return this.http.get<Tarefa>(`${this.API_URL}/${id}`);
  }

  createTarefa(task: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.API_URL, task);
  }

  updateTarefa(id: number, task: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.API_URL}/${id}`, task);
  }

  deleteTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  completarTarefa(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.API_URL}/${id}/concluir`, {});
  }
}
