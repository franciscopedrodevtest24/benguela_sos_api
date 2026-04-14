import "dotenv/config";
import { db } from "./client";
import { foundChildren, missingChildren } from "./schemas";

const genders = ["male", "female", "unknown"] as const;
const foundStatuses = ["pending_verification", "verified", "resolved", "archived"] as const;
const missingStatuses = ["active", "found", "closed", "archived"] as const;

const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const pad = (n: number) => n.toString().padStart(2, "0");

function randomDate() {
  const year = 2024 + Math.floor(Math.random() * 3);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return `${year}-${pad(month)}-${pad(day)}`;
}

function randomTime() {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return `${pad(hour)}:${pad(minute)}`;
}

async function seedFoundChildren(count = 20) {
  const data = Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    estimated_age: `${2 + (i % 12)} anos`,
    gender: pick(genders),
    physical_description: `Criança com camiseta cor ${["azul", "vermelha", "verde", "amarela"][i % 4]}.`,
    special_characteristics: i % 3 === 0 ? "Pequena cicatriz no braço esquerdo." : null,
    location_found: `Bairro ${i + 1}, Benguela`,
    date_found: randomDate(),
    time_found: randomTime(),
    current_status: "Aguardando identificação",
    additional_details: "Encontrada por moradores locais.",
    reporter_name: `Reporter Found ${i + 1}`,
    reporter_email: `found${i + 1}@example.com`,
    reporter_phone: `+244930000${pad(i + 1)}`,
    organization: i % 2 === 0 ? "ONG Benguela SOS" : null,
    status: pick(foundStatuses),
  }));

  await db.insert(foundChildren).values(data);
}

async function seedMissingChildren(count = 20) {
  const data = Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    first_name: `Nome${i + 1}`,
    last_name: `Sobrenome${i + 1}`,
    date_of_birth: `${2012 + (i % 10)}-${pad(1 + (i % 12))}-${pad(1 + (i % 28))}`,
    gender: pick(genders),
    physical_description: `Altura aproximada ${110 + i}cm, roupa ${["azul", "branca", "preta", "cinza"][i % 4]}.`,
    last_seen_location: `Zona ${i + 1}, Benguela`,
    last_seen_date: randomDate(),
    last_seen_time: randomTime(),
    circumstances: "Desapareceu durante deslocamento para casa.",
    reporter_name: `Reporter Missing ${i + 1}`,
    reporter_email: `missing${i + 1}@example.com`,
    reporter_phone: `+244940000${pad(i + 1)}`,
    relationship: "Familiar",
    status: pick(missingStatuses),
  }));

  await db.insert(missingChildren).values(data);
}

async function main() {
  // Se quiser limpar antes de inserir, descomenta:
  // await db.delete(foundChildren);
  // await db.delete(missingChildren);

  await seedFoundChildren(20);
  await seedMissingChildren(20);

  console.log("Seed concluído: 20 found_children + 20 missing_children");
}

main().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});