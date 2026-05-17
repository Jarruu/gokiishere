import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3),
  category: z.enum(['WEB', 'APP', 'MACHINE_LEARNING', 'VERILOG_FSM', 'ARDUINO_IOT', 'ALGORITHM_FLOWCHART', 'OTHERS']),
  image: z.string().min(1).optional(),
  description: z.string().min(10),
  fullContent: z.string().min(20),
  techStack: z.array(z.string()),
  completedIn: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter ya" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter ya" }),
});
