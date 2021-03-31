import * as express from "express";
import { AdminUrl, URL_TYPE } from "../../Models/AdminUrl";
import { v4 as uuidv4 } from 'uuid';
import { getAdminUrlTable } from "../database";
import { createAPIResponseString } from "../../Models/ApiResponse";


export const setupAdminUrlRoutes = (app: express.Application): void => {
    app.post("/admin/urls", (req: express.Request, res: express.Response) => {
        const adminUrl = req.body as AdminUrl;
        if (adminUrl.path.length === 0) {
            res.send(createAPIResponseString('You must include a path', 500));
        } else if (adminUrl.type != URL_TYPE.BLACKLISTED && adminUrl.type != URL_TYPE.WHITELISTED) {
            res.send(createAPIResponseString('Your type must be either blacklisted or whitelisted', 500));
        } else {
            createUrl(adminUrl).then(() => {
                res.send(createAPIResponseString(true, 200));
            }).catch(() => {
                res.send(createAPIResponseString("Failed to create Url", 500));
            });
        }
    })

    app.get("/admin/urls/all", (req: express.Request, res: express.Response) => {
        readUrl().then((adminUrls)=>res.send(createAPIResponseString(adminUrls, 200))).catch(()=>res.send(createAPIResponseString("Failed to retrieve Urls", 500)));
    })

    app.put("/admin/urls/:id", (req: express.Request, res: express.Response) => {
        const adminUrl = req.body as AdminUrl;
        updateUrl(adminUrl).then(()=>res.send(createAPIResponseString(true, 200))).catch(()=>res.send(createAPIResponseString("Failed to update Url", 500)));
    })

    app.delete("/admin/urls/:id", (req: express.Request, res: express.Response) => {
        const id = req.params.id;
        deleteUrl(id).then(()=>res.send(createAPIResponseString(true, 200))).catch(()=>res.send(createAPIResponseString("Failed to delete Url", 500)));
    })
}

// Ability to create path to URL
//
const createUrl = async (urlInfo: AdminUrl): Promise<FirebaseFirestore.WriteResult> => {
    urlInfo.id = uuidv4();
    return await getAdminUrlTable().doc(urlInfo.id).set(urlInfo);
}

// Will return full list of URLs
const readUrl = async (): Promise<AdminUrl[]> => { 
    const adminUrls:AdminUrl[] = [];
    const adminUrlsRef = getAdminUrlTable();
    const snapshot = await adminUrlsRef.get();
    snapshot.forEach((doc) => {
        adminUrls.push(doc.data() as AdminUrl)
    })
    return adminUrls;
};

const updateUrl = async (urlInfo: AdminUrl): Promise<FirebaseFirestore.WriteResult> => {
    return await getAdminUrlTable().doc(urlInfo.id).set(urlInfo);
};

const deleteUrl = async (id: string): Promise<FirebaseFirestore.WriteResult> => {
    return await getAdminUrlTable().doc(id).delete();
};

