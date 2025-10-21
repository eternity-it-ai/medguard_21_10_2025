import axios from "axios";

export async function createMedicalProcedure(data: any) {
  try {
    const response = await axios.post("/api/medical-procedures", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create medical procedure", error);
    throw error;
  }
}

export const MedicalProcedure = {
  create: createMedicalProcedure,
};

// ComplianceRule API
async function listComplianceRules() {
  try {
    const response = await axios.get("/api/compliance-rules");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch compliance rules", error);
    throw error;
  }
}

export const ComplianceRule = {
  list: listComplianceRules,
};