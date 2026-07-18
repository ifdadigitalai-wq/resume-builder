import { db } from '@/lib/db'

export async function sendNotification(userId: string, message: string, type: string) {
  const notification = await db.notification.create({
    data: { userId, message, type }
  });
  
  if (typeof global !== 'undefined' && (global as any).broadcastWSNotification) {
    (global as any).broadcastWSNotification([notification]);
  }

  return notification;
}

export async function sendManyNotifications(studentIds: string[], message: string, type: string) {
  await db.notification.createMany({
    data: studentIds.map((studentId) => ({
      userId: studentId,
      message,
      type,
    })),
  });

  const createdNotifs = await db.notification.findMany({
    where: {
      userId: { in: studentIds },
      message,
      type,
      createdAt: { gte: new Date(Date.now() - 5000) }, // Fetch records created in the last 5 seconds
    },
  });

  if (typeof global !== 'undefined' && (global as any).broadcastWSNotification) {
    (global as any).broadcastWSNotification(createdNotifs);
  }

  return createdNotifs;
}
