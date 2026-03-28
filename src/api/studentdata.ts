// src/api/studentdata.ts
import axios from "axios";

export const saveSection = async (
  studentId: string,
  sectionId: string,
  data: any,
  files = {}
) => {
  const res = await axios.post("/api/studentdata/save-section", {
    studentId,
    sectionId,
    data,
    files,
  });
  return res.data;
};

export const finalSubmit = async (studentId: string) => {
  const res = await axios.post("/api/studentdata/final-submit", { studentId });
  return res.data;
};

export const generatePdf = async (
  studentId: string,
  templateId = "template-1"
) => {
  const res = await axios.post("/api/pdf/generate", { studentId, templateId });
  return res.data;
};
