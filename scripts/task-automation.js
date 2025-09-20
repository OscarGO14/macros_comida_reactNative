#!/usr/bin/env node

/**
 * Script de automatización para gestión de tareas
 * Uso: node scripts/task-automation.js [comando] [opciones]
 */

const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'TASKS.md');
const AGENTS_DIR = path.join(__dirname, 'agents');

// Configuración de agentes
const AGENTS = {
  developer: {
    name: 'TypeScript Developer Agent',
    description: 'Agente especializado en desarrollo TypeScript/React Native',
    capabilities: [
      'Implementar mejoras en TypeScript',
      'Refactoring de código',
      'Optimización de performance',
      'Gestión de estado con Zustand',
      'Integración Firebase'
    ]
  },
  reviewer: {
    name: 'Code Review Agent',
    description: 'Agente especializado en revisión de código',
    capabilities: [
      'Análisis de calidad de código',
      'Verificación de buenas prácticas',
      'Testing de funcionalidad',
      'Validación de tipos TypeScript',
      'Revisión de patrones arquitecturales'
    ]
  }
};

// Comandos disponibles
const COMMANDS = {
  init: 'Inicializar agentes y estructura',
  assign: 'Asignar tarea a agente desarrollador',
  review: 'Asignar tarea a agente revisor',
  complete: 'Marcar tarea como completada',
  status: 'Mostrar estado actual de tareas',
  next: 'Obtener próxima tarea por prioridad'
};

class TaskManager {
  constructor() {
    this.tasksContent = '';
    this.loadTasks();
  }

  loadTasks() {
    try {
      this.tasksContent = fs.readFileSync(TASKS_FILE, 'utf8');
    } catch (error) {
      console.error('❌ Error cargando TASKS.md:', error.message);
      process.exit(1);
    }
  }

  saveTasks() {
    try {
      fs.writeFileSync(TASKS_FILE, this.tasksContent);
      console.log('✅ TASKS.md actualizado correctamente');
    } catch (error) {
      console.error('❌ Error guardando TASKS.md:', error.message);
    }
  }

  updateTaskStatus(taskNumber, field, value) {
    const taskRegex = new RegExp(
      `(### [❌✅🔄] ${taskNumber}\\. [^\\n]+[\\s\\S]*?)(- \\*\\*${field}\\*\\*: )([^\\n]+)`,
      'g'
    );

    this.tasksContent = this.tasksContent.replace(taskRegex, (match, before, fieldLabel, oldValue) => {
      return before + fieldLabel + value;
    });

    // Actualizar emoji del estado
    const statusEmoji = this.getStatusEmoji(field, value);
    if (statusEmoji) {
      const titleRegex = new RegExp(`(### )[❌✅🔄]( ${taskNumber}\\. )`, 'g');
      this.tasksContent = this.tasksContent.replace(titleRegex, `$1${statusEmoji}$2`);
    }

    this.updateStats();
    this.saveTasks();
  }

  getStatusEmoji(field, value) {
    if (field === 'Estado') {
      switch (value) {
        case 'Completada': return '✅';
        case 'En progreso': return '🔄';
        case 'En revisión': return '🔍';
        default: return '❌';
      }
    }
    return null;
  }

  updateStats() {
    const tasks = this.extractTasks();
    const completed = tasks.filter(t => t.status === 'Completada').length;
    const inProgress = tasks.filter(t => t.status === 'En progreso' || t.status === 'En revisión').length;
    const pending = tasks.filter(t => t.status === 'Pendiente').length;

    // Actualizar estado general
    const stateRegex = /## Estado: \d+\/\d+ completadas/;
    this.tasksContent = this.tasksContent.replace(stateRegex, `## Estado: ${completed}/13 completadas`);

    // Actualizar estadísticas
    const statsSection = /- \*\*Completadas\*\*: \d+\n- \*\*En progreso\*\*: \d+\n- \*\*Pendientes\*\*: \d+/;
    const statsReplacement = `- **Completadas**: ${completed}\n- **En progreso**: ${inProgress}\n- **Pendientes**: ${pending}`;
    this.tasksContent = this.tasksContent.replace(statsSection, statsReplacement);
  }

  extractTasks() {
    const taskRegex = /### [❌✅🔄] (\d+)\. ([^\\n]+)[\\s\\S]*?- \*\*Estado\*\*: ([^\\n]+)/g;
    const tasks = [];
    let match;

    while ((match = taskRegex.exec(this.tasksContent)) !== null) {
      tasks.push({
        number: parseInt(match[1]),
        title: match[2],
        status: match[3]
      });
    }

    return tasks;
  }

  assignTask(taskNumber, agent) {
    const currentDate = new Date().toISOString().split('T')[0];
    const agentName = AGENTS[agent]?.name || agent;

    this.updateTaskStatus(taskNumber, 'Estado', 'En progreso');
    this.updateTaskStatus(taskNumber, 'Desarrollador', agentName);

    console.log(`🔄 Tarea ${taskNumber} asignada a ${agentName}`);
    this.generateAgentPrompt(taskNumber, agent);
  }

  reviewTask(taskNumber, agent) {
    const currentDate = new Date().toISOString().split('T')[0];
    const agentName = AGENTS[agent]?.name || agent;

    this.updateTaskStatus(taskNumber, 'Estado', 'En revisión');
    this.updateTaskStatus(taskNumber, 'Revisor', agentName);

    console.log(`🔍 Tarea ${taskNumber} en revisión por ${agentName}`);
    this.generateReviewPrompt(taskNumber);
  }

  completeTask(taskNumber) {
    const currentDate = new Date().toISOString().split('T')[0];

    this.updateTaskStatus(taskNumber, 'Estado', 'Completada');
    this.updateTaskStatus(taskNumber, 'Fecha completada', currentDate);

    console.log(`✅ Tarea ${taskNumber} marcada como completada`);
  }

  generateAgentPrompt(taskNumber, agentType) {
    const task = this.getTaskDetails(taskNumber);
    if (!task) return;

    const prompt = `
# Prompt para ${AGENTS[agentType].name}

## Tarea Asignada: ${task.title}

### Descripción
${task.problem}

### Archivos a modificar
${task.files}

### Impacto esperado
${task.impact}

### Tiempo estimado
${task.estimation}

### Instrucciones específicas
1. Analiza el código actual en los archivos mencionados
2. Implementa la solución siguiendo las mejores prácticas de TypeScript/React Native
3. Asegúrate de mantener la consistencia con el resto del codebase
4. Incluye comentarios explicativos en español donde sea necesario
5. Verifica que no rompes funcionalidad existente

### Criterios de aceptación
- [ ] Código implementado sin errores de TypeScript
- [ ] Funcionalidad probada manualmente
- [ ] Código formateado con Prettier/ESLint
- [ ] Consistente con patrones existentes del proyecto
- [ ] Documentación actualizada si es necesario

### Comando para completar
\`\`\`bash
node scripts/task-automation.js complete ${taskNumber}
\`\`\`
`;

    const promptFile = path.join(AGENTS_DIR, `task-${taskNumber}-dev-prompt.md`);
    this.ensureAgentsDir();
    fs.writeFileSync(promptFile, prompt);

    console.log(`📝 Prompt generado: ${promptFile}`);
  }

  generateReviewPrompt(taskNumber) {
    const task = this.getTaskDetails(taskNumber);
    if (!task) return;

    const prompt = `
# Prompt para Code Review Agent

## Tarea a Revisar: ${task.title}

### Checklist de Revisión

#### 🔍 Análisis de Código
- [ ] Código TypeScript sin errores de tipos
- [ ] Funciones bien tipadas con interfaces apropiadas
- [ ] Manejo adecuado de errores y casos edge
- [ ] Performance optimizada
- [ ] Código limpio y legible

#### 🏗️ Arquitectura
- [ ] Patrones arquitecturales consistentes
- [ ] Separación de responsabilidades
- [ ] Reutilización de código existente
- [ ] Integración correcta con Firebase/Zustand

#### 🧪 Funcionalidad
- [ ] Funcionalidad implementada completamente
- [ ] No rompe funcionalidad existente
- [ ] UX mejorada según la tarea
- [ ] Casos de error manejados apropiadamente

#### 📚 Documentación
- [ ] Comentarios en español donde corresponde
- [ ] CLAUDE.md actualizado si es necesario
- [ ] README actualizado si aplica

### Instrucciones
1. Revisa todos los archivos modificados
2. Ejecuta \`npm run lint\` y \`npm run build:web\`
3. Prueba la funcionalidad manualmente
4. Si encuentras problemas, documéntalos y asigna de vuelta al desarrollador
5. Si todo está correcto, marca la tarea como completada

### Comando para aprobar
\`\`\`bash
node scripts/task-automation.js complete ${taskNumber}
\`\`\`
`;

    const promptFile = path.join(AGENTS_DIR, `task-${taskNumber}-review-prompt.md`);
    this.ensureAgentsDir();
    fs.writeFileSync(promptFile, prompt);

    console.log(`📝 Prompt de revisión generado: ${promptFile}`);
  }

  getTaskDetails(taskNumber) {
    const taskRegex = new RegExp(
      `### [❌✅🔄] ${taskNumber}\\. ([^\\n]+)[\\s\\S]*?- \\*\\*Problema\\*\\*: ([^\\n]+)[\\s\\S]*?- \\*\\*Impacto\\*\\*: ([^\\n]+)[\\s\\S]*?- \\*\\*Estimación\\*\\*: ([^\\n]+)[\\s\\S]*?- \\*\\*Archivos\\*\\*: ([^\\n]+)`,
      'g'
    );

    const match = taskRegex.exec(this.tasksContent);
    if (!match) return null;

    return {
      title: match[1],
      problem: match[2],
      impact: match[3],
      estimation: match[4],
      files: match[5]
    };
  }

  getNextTask() {
    const tasks = this.extractTasks();
    const pendingTasks = tasks.filter(t => t.status === 'Pendiente');

    if (pendingTasks.length === 0) {
      console.log('🎉 ¡Todas las tareas están completadas o en progreso!');
      return;
    }

    const nextTask = pendingTasks[0]; // Primera tarea pendiente (ya están ordenadas por prioridad)
    console.log(`🎯 Próxima tarea recomendada: Tarea ${nextTask.number} - ${nextTask.title}`);
    console.log(`\nPara asignar: node scripts/task-automation.js assign ${nextTask.number} developer`);
  }

  showStatus() {
    const tasks = this.extractTasks();
    console.log('\n📊 Estado actual de las tareas:\n');

    tasks.forEach(task => {
      const emoji = task.status === 'Completada' ? '✅' :
                   task.status === 'En progreso' ? '🔄' :
                   task.status === 'En revisión' ? '🔍' : '❌';
      console.log(`${emoji} ${task.number}. ${task.title} (${task.status})`);
    });

    const completed = tasks.filter(t => t.status === 'Completada').length;
    console.log(`\n📈 Progreso: ${completed}/13 tareas completadas (${Math.round(completed/13*100)}%)`);
  }

  ensureAgentsDir() {
    if (!fs.existsSync(AGENTS_DIR)) {
      fs.mkdirSync(AGENTS_DIR, { recursive: true });
    }
  }

  init() {
    this.ensureAgentsDir();

    // Crear archivos de configuración de agentes
    Object.entries(AGENTS).forEach(([key, agent]) => {
      const configFile = path.join(AGENTS_DIR, `${key}-config.json`);
      fs.writeFileSync(configFile, JSON.stringify(agent, null, 2));
    });

    console.log('🚀 Sistema de agentes inicializado');
    console.log(`📁 Directorio de agentes: ${AGENTS_DIR}`);
    console.log('📝 Archivos de configuración creados');
  }
}

// CLI Interface
function main() {
  const [,, command, ...args] = process.argv;
  const taskManager = new TaskManager();

  switch (command) {
    case 'init':
      taskManager.init();
      break;

    case 'assign':
      const [taskNum, agent = 'developer'] = args;
      if (!taskNum) {
        console.error('❌ Uso: assign <número_tarea> [agente]');
        process.exit(1);
      }
      taskManager.assignTask(parseInt(taskNum), agent);
      break;

    case 'review':
      const [reviewTaskNum, reviewer = 'reviewer'] = args;
      if (!reviewTaskNum) {
        console.error('❌ Uso: review <número_tarea> [revisor]');
        process.exit(1);
      }
      taskManager.reviewTask(parseInt(reviewTaskNum), reviewer);
      break;

    case 'complete':
      const [completeTaskNum] = args;
      if (!completeTaskNum) {
        console.error('❌ Uso: complete <número_tarea>');
        process.exit(1);
      }
      taskManager.completeTask(parseInt(completeTaskNum));
      break;

    case 'status':
      taskManager.showStatus();
      break;

    case 'next':
      taskManager.getNextTask();
      break;

    default:
      console.log('🤖 Sistema de Automatización de Tareas\n');
      console.log('Comandos disponibles:');
      Object.entries(COMMANDS).forEach(([cmd, desc]) => {
        console.log(`  ${cmd.padEnd(10)} - ${desc}`);
      });
      console.log('\nEjemplos:');
      console.log('  node scripts/task-automation.js init');
      console.log('  node scripts/task-automation.js assign 1 developer');
      console.log('  node scripts/task-automation.js review 1 reviewer');
      console.log('  node scripts/task-automation.js complete 1');
      console.log('  node scripts/task-automation.js status');
      console.log('  node scripts/task-automation.js next');
  }
}

if (require.main === module) {
  main();
}

module.exports = TaskManager;