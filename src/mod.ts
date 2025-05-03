import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import * as config from "../config/config.json";

const secureContainers = {
    "kappa": "5c093ca986f7740a1867ab12",
    "kappa_cult": "676008db84e242067d0dc4c9",
    "gamma": "5857a8bc2459772bad15db29",
    "gamma_tue":"665ee77ccf2d642e98220bca",
    "epsilon": "59db794186f77448bc595262",
    "beta": "5857a8b324597729ab0a0e7d",
    "alpha": "544a11ac4bdc2d470e8b456a",
    "waistPouch": "5732ee6a24597719ae0c0281"
};

class Mod implements IPostDBLoadMod, IPostSptLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        
        const customItem = container.resolve<CustomItemService>("CustomItemService");
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        const itemId = "674f974b8c797c96be0b096c";


        const miccCase: NewItemFromCloneDetails = {
            itemTplToClone: "5d235bb686f77443f4331278",
            overrideProperties: {
                Name: "Medical SICC",
                ShortName: "M I C C",
                Description: "SICC case for medical items.",
                Prefab: {
                    "path": "assets/content/items/containers/item_container_lopouch/micc.bundle",
                    "rcid": ""
                },
                Grids: [
                    {
                        "_name": "main",
                        "_id": "5d235bb686f77443f433127a",
                        "_parent": itemId,
                        "_props": {
                            "filters": [
                                {
                                    "Filter": [
                                        "543be5664bdc2dd4348b4569",
                                        "619cbf7d23893217ec30b689"
                                    ],
                                    "ExcludedFilter": []
                                }
                            ],
                            "cellsH": config.cellH,
                            "cellsV": config.cellV,
                            "minCount": 0,
                            "maxCount": 0,
                            "maxWeight": 0,
                            "isSortingTable": false
                        },
                        "_proto": "55d329c24bdc2d892f8b4567"
                    }
                ]
            },
            parentId: "5795f317245977243854e041",
            newId: itemId,
            fleaPriceRoubles: config.price,
            handbookPriceRoubles: config.price,
            handbookParentId: "5b5f6fa186f77409407a7eb7",
            locales: {
                en: {
                    name: "Medical SICC case",
                    shortName: "M I C C",
                    description: "A SICC case for medical items."
                }
            }
        };

        customItem.createItemFromClone(miccCase);

        const traders = tables.traders["54cb57776803fa99248b456e"];

        traders.assort.items.push({
            "_id": itemId,
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 99999
            }
        });
        traders.assort.barter_scheme[itemId] = [
            [
                {
                    "count": config.price,
                    "_tpl": "5449016a4bdc2d6f028b456f"
                }
            ]
        ];
        traders.assort.loyal_level_items[itemId] = config.loyalty_lvl;

        this.allowMiccIntoContainers(itemId, tables.templates.items, secureContainers);
        this.allowMiccIntoContainers(itemId, tables.templates.items, config.containers);
    }
    allowMiccIntoContainers(itemId, items, containers): void 
    {
        let currentCase = null;

        try 
        {
            for (const secureCase in containers) 
            {                
                currentCase = secureCase;
                items[containers[secureCase]]
                    ._props
                    .Grids[0]
                    ._props
                    .filters[0]
                    .Filter
                    .push(itemId)
            }
        }
        catch (error) 
        {
            // In case a mod that changes the containers does remove the 'Filter' from filters array
            items[containers[currentCase]]
                ._props
                .Grids[0]
                ._props
                .filters
                .push(
                    {"Filter": [itemId]}
                );
                
        }
    }

    public postSptLoad(container: DependencyContainer): void 
    {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;

        if (item["674f974b8c797c96be0b096c"]._props !== null) 
        {
            console.log("MICC has loaded.")
        }
        else 
        {
            console.log("MICC hasn't loaded.")
        }
    }
}

export const mod = new Mod();
