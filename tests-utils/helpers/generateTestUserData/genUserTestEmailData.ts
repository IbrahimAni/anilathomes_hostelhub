import { UserRole } from "@/types/user";
import { genRandomNumber } from "../genRandomNumber";

export const genTestUserEmailData = (userRole: UserRole, testEmail?: string): string => {
    const emailDomain = "@wptest.com";
    const emailPrefix = `${userRole}-test-user-${genRandomNumber()}`;
    const email = testEmail || `${emailPrefix}${emailDomain}`;
    return email;
};