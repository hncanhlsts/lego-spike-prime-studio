// Module giao tiếp Web Bluetooth (BLE) với LEGO® Education SPIKE™ Prime Hub
// Hỗ trợ LEGO Wireless Protocol v3 (UUID: 00001623-1212-efde-1623-785feabcd123)
// và Pybricks / SPIKE 3 BLE Command Service

const LWP3_HUB_SERVICE_UUID = '00001623-1212-efde-1623-785feabcd123';
const LWP3_HUB_CHAR_UUID = '00001624-1212-efde-1623-785feabcd123';
const SPIKE3_SERVICE_UUID = 0xfd02;

export class SpikeBluetoothManager {
  constructor(onStatusChange, onTelemetryUpdate) {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
    this.isSimulatedHardware = false;
    this.onStatusChange = onStatusChange || (() => {});
    this.onTelemetryUpdate = onTelemetryUpdate || (() => {});
  }

  isWebBluetoothSupported() {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async connectRealHub() {
    if (!this.isWebBluetoothSupported()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ Web Bluetooth API. Vui lòng dùng Google Chrome hoặc Microsoft Edge.');
    }

    this.onStatusChange({ state: 'connecting', message: 'Đang tìm kiếm LEGO SPIKE Prime Hub qua Bluetooth...' });

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [LWP3_HUB_SERVICE_UUID] },
        { services: [SPIKE3_SERVICE_UUID] },
        { namePrefix: 'LEGO' },
        { namePrefix: 'SPIKE' },
        { namePrefix: 'Pybricks' }
      ],
      optionalServices: [LWP3_HUB_SERVICE_UUID, SPIKE3_SERVICE_UUID]
    });

    this.device = device;
    device.addEventListener('gattserverdisconnected', () => {
      this.isConnected = false;
      this.onStatusChange({ state: 'disconnected', message: 'Đã ngắt kết nối với SPIKE Prime Hub.' });
    });

    this.server = await device.gatt.connect();
    this.isConnected = true;
    this.isSimulatedHardware = false;

    try {
      const service = await this.server.getPrimaryService(LWP3_HUB_SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(LWP3_HUB_CHAR_UUID);
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        this.handleIncomingNotification(event.target.value);
      });
    } catch {
      // Nếu Hub chạy firmware SPIKE 3 khác UUID chuẩn LWP3, vẫn giữ kết nối GATT để gửi lệnh
    }

    this.onStatusChange({
      state: 'connected',
      hubName: device.name || 'LEGO SPIKE Prime Hub',
      message: `Đã kết nối trực tiếp với ${device.name || 'SPIKE Prime Hub'}!`
    });

    return device.name || 'LEGO SPIKE Prime Hub';
  }

  handleIncomingNotification(dataView) {
    // Giải mã gói tin phản hồi từ các cổng I/O của Hub thật (nếu có)
    if (dataView && dataView.byteLength >= 4) {
      const msgType = dataView.getUint8(2);
      if (msgType === 0x45) {
        const portId = dataView.getUint8(3);
        const value = dataView.getInt8(4);
        this.onTelemetryUpdate({ portId, value });
      }
    }
  }

  async sendCommandPacket(bytes) {
    if (this.isConnected && this.characteristic) {
      const payload = new Uint8Array(bytes);
      await this.characteristic.writeValue(payload);
      return true;
    }
    return false;
  }

  disconnect() {
    if (this.device && this.device.gatt && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.isSimulatedHardware = false;
    this.onStatusChange({ state: 'disconnected', message: 'Đã ngắt kết nối Hub.' });
  }
}
