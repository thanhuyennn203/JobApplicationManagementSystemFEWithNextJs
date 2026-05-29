export enum ApplicationEmailNotificationPreference {
  DAILY = "DAILY_MORNING",
  EACH_APPLICATION = "EACH_APPLICATION",
  NONE = "NONE",
}
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

const BASE_URL = "http://localhost:9191/api/companies";

export const updateApplicationEmailNotificationPreference = async (
  companyId: number,
  preference: ApplicationEmailNotificationPreference,
) => {
  const response = await fetch(
    `${BASE_URL}/${companyId}/application-email-notification-preference`,
    {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({
        preference,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update email preference");
  }

  return response.json();
};

export const getApplicationEmailNotificationPreference = async (
  companyId: number
): Promise<ApplicationEmailNotificationPreference> => {

  const response = await fetch(
    `${BASE_URL}/${companyId}/application-email-notification-preference`,
    {
      method: "GET",
      headers: getAuthHeader(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch email preference");
  }

  return response.json();
};