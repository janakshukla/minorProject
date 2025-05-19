import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { useUserStore } from '@/store/userstore';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    //@ts-ignore
    const { locations } = data;
    const location = locations[0];
    try {
      const childId = useUserStore().user?.id 
      await fetch('https://your-api.com/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      });
    } catch (err) {
      console.error('Error sending background location:', err);
    }
  }
});

export const startBackgroundLocationTracking = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

  if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
    console.log('Location permission not granted');
    return;
  }

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5 * 60 * 1000, // every 5 minutes
      distanceInterval: 50, // every 50 meters
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Location Tracking',
        notificationBody: 'Tracking child location in background',
      },
    });
  }
};
