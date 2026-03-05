import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class ConsultarDisponibilidadUseCase {
    constructor(private readonly citaRepository: ICitaRepository) { }

    async execute(medicoId: number, fecha: Date): Promise<string[]> {
        // Horario laboral de ejemplo: 08:00 a 18:00
        const horasTrabajoInicio = 8;
        const horasTrabajoFin = 18;

        const inicioDia = new Date(fecha);
        inicioDia.setHours(horasTrabajoInicio, 0, 0, 0);

        const finDia = new Date(fecha);
        finDia.setHours(horasTrabajoFin, 0, 0, 0);

        // Obtener las citas del día para este médico
        const citasDelDia = await this.citaRepository.findActivasByMedicoAndDate(medicoId, fecha);

        // Simplificar: Generar bloques de 30 mins y remover los ocupados
        const huecos: string[] = [];
        let horaActual = new Date(inicioDia);

        while (horaActual < finDia) {
            const proximo = new Date(horaActual.getTime() + 30 * 60000); // +30 min

            // Comprobar si hay alguna cita en este bloque
            const ocupado = citasDelDia.some(cita => {
                const inicioCita = new Date(cita.fechaHora);
                const finCita = new Date(inicioCita.getTime() + 30 * 60000);
                return (horaActual >= inicioCita && horaActual < finCita) ||
                    (proximo > inicioCita && proximo <= finCita) ||
                    (inicioCita >= horaActual && inicioCita < proximo);
            });

            if (!ocupado && horaActual > new Date()) {
                huecos.push(horaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }

            horaActual = proximo;
        }

        return huecos;
    }
}
