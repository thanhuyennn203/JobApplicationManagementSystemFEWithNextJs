import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    followCompany,
    unfollowCompany,
    checkFollowCompany
} from "@/services/companies/company.service";

export function useFollowCompany(companyId?: number) {
    const auth = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth?.user || !companyId) return;

        const fetch = async () => {
            try {
                const res = await checkFollowCompany(auth.user.candidateId, companyId);
                setIsFollowing(res);
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, [auth?.user, companyId]);

    const toggleFollow = async () => {
        if (!auth?.user) {
            alert("You have to login first");
            return;
        }

        if (auth.user.roles?.[0] !== "CANDIDATE") {
            alert("Only candidates can follow");
            return;
        }

        if (!companyId) return;

        try {
            setLoading(true);

            if (isFollowing) {
                await unfollowCompany(auth.user.candidateId, companyId);
                setIsFollowing(false);
            } else {
                await followCompany(auth.user.candidateId, companyId);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { isFollowing, loading, toggleFollow };
}