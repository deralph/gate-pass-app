// src/services/scanService.ts
import api from "./api";

export const processScan = async (
  data: string,
  qrCodeData: any,
  studentStaffId: string
) => {
  console.log(
    "qrCodeData = ",
    qrCodeData,
    " studentStaffId = ",
    studentStaffId
  );
  try {
    const response = await api.post("/scans/process", {
      data,
      qrCodeData,
      studentStaffId,
    });
    return response.data;
  } catch (error: any) {
    console.log("scan error = ", error);
    throw new Error(error.response?.data?.message || "Failed to process scan");
  }
};

export const updateScanResult = async (
  scanId: string,
  result: "approved" | "denied",
  reason?: string
) => {
  try {
    const resp = await api.put(`/scans/${scanId}/result`, {
      result,
      reason,
    });
    return resp.data;
  } catch (err: any) {
    console.error(
      "updateScanResult error:",
      err?.response?.data ?? err.message
    );
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getScanHistory = async (userId?: string, limit = 20) => {
  try {
    const url = userId
      ? `/scans/history?userId=${userId}&limit=${limit}`
      : `/scans/history?limit=${limit}`;

    const response = await api.get(url);

    // console.log("scan response = ", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch scan history"
    );
  }
};

export const getScanDetails = async (scanId: string) => {
  try {
    const response = await api.get(`/scans/${scanId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch scan details"
    );
  }
};
