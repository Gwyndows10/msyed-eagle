import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectMongoDB();
    
    const CheckInStatus = mongoose.models.CheckInStatus || mongoose.model('CheckInStatus', new mongoose.Schema({
      userId: String,
      isCheckedIn: Boolean,
      lastUpdated: Date,
      lastUpdatedBy: String
    }));
    
    const statuses = await CheckInStatus.find({}).lean();
    
    // Convert to a map of userId -> isCheckedIn for easy lookup
    const statusMap = {};
    statuses.forEach(status => {
      statusMap[status.userId] = status.isCheckedIn;
    });
    
    return NextResponse.json({ statusMap });
    
  } catch (error) {
    console.error('Error fetching check-in status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-in status' },
      { status: 500 }
    );
  }
} 