import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { Badge } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR'; // Adjust based on your roles
  password: string;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  siteMockup: string;
  techonology: string[]; // Typo preserved if API returns it this way
  features: string[];
  services: string[];
  elements: number;
  totalCode: number;
  gitHubLink: string;
  liveLink: string;
  type: string;
  isFeatured: boolean;
  projectStartDate: string; // ISO date string
  projectEndDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: IUser;
}

interface ProjectCardProps {
  project: IProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.siteMockup || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="flex-grow p-6">
        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techonology.map((tech) => (
            <p key={tech} className="font-normal">
              {tech}
            </p>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        <Link href={`/projects/${project.id}`} className="flex-1">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
