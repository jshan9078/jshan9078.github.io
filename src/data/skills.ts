import Assets from "./assets";
import type { Skill } from "./types";

const defineSkill = (
  slug: string,
  name: string,
  logo: { light: string; dark: string },
  color: string,
): Skill => ({
  slug,
  name,
  logo,
  color,
});

const skills: Skill[] = [
  defineSkill("ts", "TypeScript", Assets.TypeScript, "blue"),
  defineSkill("js", "JavaScript", Assets.JavaScript, "yellow"),
  defineSkill("python", "Python", Assets.Python, "yellow"),
  defineSkill("cpp", "C++", Assets.Cpp, "blue"),
  defineSkill("html", "HTML", Assets.HTML, "lightblue"),
  defineSkill("css", "CSS", Assets.CSS, "blue"),
  defineSkill("reactjs", "React", Assets.ReactJs, "cyan"),
  defineSkill("next", "Next.js", Assets.Next, "black"),
  defineSkill("svelte", "Svelte", Assets.Svelte, "lightblue"),
  defineSkill("express", "Express", Assets.ExpressJs, "red"),
  defineSkill("fastapi", "FastAPI", Assets.FastAPI, "turquoise"),
  defineSkill("django", "Django", Assets.Django, "green"),
  defineSkill("rails", "Ruby on Rails", Assets.RubyOnRails, "red"),
  defineSkill("docker", "Docker", Assets.Docker, "brown"),
  defineSkill("kubernetes", "Kubernetes", Assets.Kubernetes, "blue"),
  defineSkill("terraform", "Terraform", Assets.Terraform, "purple"),
  defineSkill("PostgreSQL", "PostgreSQL", Assets.PostgreSQL, "blue"),
  defineSkill("mongodb", "MongoDB", Assets.MongoDB, "green"),
  defineSkill("supabase", "Supabase", Assets.Supabase, "green"),
  defineSkill("firebase", "Firebase", Assets.Firebase, "lightblue"),
  defineSkill("redis", "Redis", Assets.Redis, "red"),
  defineSkill("llm", "LLMs", Assets.LLM, "blue"),
  defineSkill("vertex", "Google Vertex AI", Assets.Vertex, "red"),
  defineSkill("langchain", "Langchain", Assets.LangChain, "green"),
  defineSkill("pytorch", "PyTorch", Assets.PyTorch, "lightblue"),
  defineSkill("tensorflow", "TensorFlow", Assets.TensorFlow, "lightblue"),
  defineSkill("scikit", "scikit-learn", Assets.Scikit, "lightblue"),
  defineSkill("opencv", "OpenCV", Assets.OpenCV, "blue"),
  defineSkill("arduino", "Arduino", Assets.Arduino, "red"),
  defineSkill("rpi", "Raspberry Pi", Assets.RaspberryPi, "red"),
  defineSkill("gcp", "Google Cloud", Assets.GCP, "red"),
  defineSkill("aws", "AWS", Assets.AWS, "yellow"),
  defineSkill("graphql", "GraphQL", Assets.GraphQL, "pink"),
  defineSkill("kafka", "Apache Kafka", Assets.Kafka, "black"),
  defineSkill("stripe", "Stripe", Assets.Stripe, "blue"),
  defineSkill("multi-agent", "Multi-agent Systems", Assets.MultiAgent, "blue"),
  defineSkill("temporal", "Temporal", Assets.Temporal, "blue"),
  defineSkill("compilers", "Compilers", Assets.Compilers, "red"),
  defineSkill("maps", "Mapping", Assets.Map, "green"),
  defineSkill("mocha", "Mocha", Assets.Mocha, "brown"),
  defineSkill("matplotlib", "Matplotlib", Assets.Matplotlib, "lightblue"),
];

export const getSkills = (...slugs: string[]): Skill[] => {
  if (slugs.length === 0) return skills;
  return skills.filter((s) => slugs.includes(s.slug));
};

export default skills;
