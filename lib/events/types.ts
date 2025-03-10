export interface Event {
  id: number;
  name: string;
  description: string;
  attendancePoints: number;
  time: string;
  contactOrganizer: string | null;
}
