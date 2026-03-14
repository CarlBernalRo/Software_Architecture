import { ICitaRepository } from "../../domain/repositories/ICitaRepository";

export class ConsultarDisponibilidadUseCase {
    constructor(private readonly citaRepository: ICitaRepository) { }

    async execute(medicoId: number, fecha: Date | string): Promise<string[]> {
        // Horario laboral de ejemplo: 08:00 a 18:00
        const horasTrabajoInicio = 8;
        const horasTrabajoFin = 18;

        // Ensure `fecha` is treated as local timezone date "YYYY-MM-DD" instead of "YYYY-MM-DDT00:00:00Z"
        let year, month, day;
        if (typeof fecha === 'string') {
            const parts = fecha.split('-');
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            day = parseInt(parts[2], 10);
        } else {
            year = fecha.getFullYear();
            month = fecha.getMonth();
            day = fecha.getDate();
        }

        const inicioDia = new Date(year, month, day);
        inicioDia.setHours(horasTrabajoInicio, 0, 0, 0);

        const finDia = new Date(year, month, day);
        finDia.setHours(horasTrabajoFin, 0, 0, 0);

        // Fetch using the local `inicioDia` because it represents the actual start of the requested day
        const citasDelDia = await this.citaRepository.findActivasByMedicoAndDate(medicoId, inicioDia);

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
                const hh = String(horaActual.getHours()).padStart(2, '0');
                const mm = String(horaActual.getMinutes()).padStart(2, '0');
                huecos.push(`${hh}:${mm}:00`);
            }

            horaActual = proximo;
        }

        return huecos;
    }
}
