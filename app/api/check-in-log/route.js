import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received check-in log request:', body);
    
    const { userId, userName, action, timestamp, checkedInBy } = body;
    
    if (!userId || !action || !timestamp || !checkedInBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 500 }
      );
    }

    await connectMongoDB();
    
    const logEntry = {
      userId,
      userName,
      action,
      timestamp: new Date(timestamp),
      checkedInBy,
      createdAt: new Date()
    };

    // Create a simple schema for check-in logs
    const CheckInLog = mongoose.models.CheckInLog || mongoose.model('CheckInLog', new mongoose.Schema({
      userId: String,
      userName: String,
      action: String,
      timestamp: Date,
      checkedInBy: String,
      createdAt: Date
    }));

    console.log('Creating log entry:', logEntry);
    const result = await CheckInLog.create(logEntry);
    console.log('Log entry created:', result);
    
    // Also update the current check-in status
    const statusUpdate = {
      userId,
      isCheckedIn: action === 'checked in',
      lastUpdated: new Date(),
      lastUpdatedBy: checkedInBy
    };
    
    const CheckInStatus = mongoose.models.CheckInStatus || mongoose.model('CheckInStatus', new mongoose.Schema({
      userId: String,
      isCheckedIn: Boolean,
      lastUpdated: Date,
      lastUpdatedBy: String
    }));
    
    await CheckInStatus.findOneAndUpdate(
      { userId },
      statusUpdate,
      { upsert: true, new: true }
    );
    
    return NextResponse.json({
      success: true,
      logId: result.insertedId,
      message: 'Check-in logged successfully'
    });

  } catch (error) {
    console.error('Error logging check-in:', error);
    return NextResponse.json(
      { error: 'Failed to log check-in' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    await connectMongoDB();
    
    const CheckInLog = mongoose.models.CheckInLog || mongoose.model('CheckInLog', new mongoose.Schema({
      userId: String,
      action: String,
      timestamp: Date,
      checkedInBy: String,
      createdAt: Date
    }));
    
    const logs = await CheckInLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    
    console.log('Retrieved logs:', logs);
    return NextResponse.json({ logs });
    
  } catch (error) {
    console.error('Error fetching check-in logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 