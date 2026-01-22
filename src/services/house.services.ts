import type { Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createHouse(userId: string, name:string, res: Response) {
    if (!name) {
        return res.status(400).json({ message: "House name is required" });
    }
    const house = await prisma.house.create({
        data: {
            name: name,
            creator: {
                connect: {
                    id: userId
                }
            }
        }
    });
    return res.status(201).json({ message: "House created successfully", house });
}

export async function getHousesByUserId(userId: string , res: Response) {
    const houses = await prisma.house.findMany({
        where: {
            creatorId: userId
        },
        include: {
            categories: true
        }
    });
    return res.status(200).json({ houses });
}

export async function deleteHouse(userId: string, houseId: string, res: Response) {
    const house = await prisma.house.findUnique({
        where: {
            id: houseId
        }
    });
    if (!house) {
        return res.status(404).json({ message: "House not found" });
    }

    if (house.creatorId !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this house" });
    }
    await prisma.house.delete({
        where: {
            id: houseId
        }
    });
    return res.status(200).json({ message: "House deleted successfully" });


}