import { genderEnum } from "../db/schemas/enums";










type Gender=typeof genderEnum.enumValues[number]
export const genderLabels: Record<Gender, string> = {
  male: "Masculino",
  female: "Feminino",
  unknown: "Desconhecido",
};