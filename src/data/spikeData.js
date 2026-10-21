// Danh mục linh kiện phần cứng chuẩn từ https://spike.legoeducation.com/prime/project
export const SPIKE_DEVICES = {
  NONE: {
    id: 'none',
    name: 'Trống (Empty Port)',
    shortName: 'Empty',
    category: 'none',
    color: '#475569',
    kit: '-',
    description: 'Cổng chưa gắn thiết bị.'
  },
  MEDIUM_MOTOR: {
    id: 'medium_motor',
    name: 'Medium Angular Motor (Động cơ Vừa)',
    shortName: 'Medium Motor',
    category: 'motor',
    color: '#0090FF',
    kit: 'Core 45678',
    description: 'Động cơ phản hồi nhanh, tích hợp cảm biến góc quay 1° (0-359°). Dùng cho 2 bánh xe dẫn động (Driving Base 1/2/3).'
  },
  LARGE_MOTOR: {
    id: 'large_motor',
    name: 'Large Angular Motor (Động cơ Lớn)',
    shortName: 'Large Motor',
    category: 'motor',
    color: '#0077B6',
    kit: 'Core 45678 + Expansion 45681',
    description: 'Mô-men xoắn cực đại cao, dùng cho cơ cấu nâng hạ cánh tay robot (Dozer Blade, Lift Arm, Super Cleanup Grabber).'
  },
  COLOR_SENSOR: {
    id: 'color_sensor',
    name: 'Color Sensor (Cảm biến Màu sắc)',
    shortName: 'Color Sensor',
    category: 'sensor',
    color: '#0EB8D6',
    kit: 'Core 45678',
    description: 'Nhận diện màu chuẩn LEGO (Black 0, Violet 1, Blue 3, Cyan 4, Green 6, Yellow 7, Red 9, White 10) và Reflected Light (0-100%).'
  },
  DISTANCE_SENSOR: {
    id: 'distance_sensor',
    name: 'Distance Sensor (Cảm biến Khoảng cách)',
    shortName: 'Distance Sensor',
    category: 'sensor',
    color: '#0EB8D6',
    kit: 'Core 45678',
    description: 'Đo khoảng cách bằng sóng siêu âm (0-200 cm / %) và điều khiển 4 đèn LED quanh mắt cảm biến.'
  },
  FORCE_SENSOR: {
    id: 'force_sensor',
    name: 'Force Sensor (Cảm biến Lực)',
    shortName: 'Force Sensor',
    category: 'sensor',
    color: '#0EB8D6',
    kit: 'Core 45678',
    description: 'Phát hiện thao tác chạm (pressed / hard-pressed / released) và đo lực nhấn bằng Newton (0-10 N) hoặc %.'
  },
  COLOR_MATRIX_3X3: {
    id: 'color_matrix_3x3',
    name: '3x3 Color Light Matrix (Ma trận màu 3x3)',
    shortName: '3x3 Matrix',
    category: 'light',
    color: '#7C4DFF',
    kit: 'SPIKE Essential / Expansion',
    description: 'Ma trận đèn 9 điểm ảnh RGB đa sắc kết nối qua cổng I/O.'
  }
};

// 6 Loại hình dạng khối lệnh chuẩn trong LEGO Education SPIKE Prime
export const BLOCK_SHAPE_GUIDE = [
  {
    id: 'hat',
    nameVi: 'Khối mũ (Hat Blocks)',
    nameEn: 'Hat Block',
    color: '#E6A800',
    sampleText: 'when program starts',
    description: 'Luôn nằm trên cùng để bắt đầu một chồng lệnh khi có sự kiện xảy ra. Đỉnh bo tròn, chỉ gắn được khối khác ở bên dưới.'
  },
  {
    id: 'stack',
    nameVi: 'Khối lệnh (Stack Blocks)',
    nameEn: 'Stack Block',
    color: '#0090FF',
    sampleText: 'A run ↻ for 1 rotations',
    description: 'Thực hiện các câu lệnh chính (quay động cơ, bật đèn, phát nhạc). Có khấc lõm ở trên và mấu lồi ở dưới.'
  },
  {
    id: 'c_block',
    nameVi: 'Khối chữ C (C Blocks)',
    nameEn: 'C Block (Loop / If)',
    color: '#FFAB19',
    sampleText: 'repeat 10 / forever / if ... then',
    description: 'Có hình chữ C bao quanh các khối lệnh khác để tạo vòng lặp hoặc kiểm tra điều kiện Đúng/Sai.'
  },
  {
    id: 'reporter',
    nameVi: 'Khối báo giá trị (Reporter Blocks)',
    nameEn: 'Reporter Block',
    color: '#28A745',
    sampleText: 'pick random 1 to 10 / ( ) + ( )',
    description: 'Hình viên thuốc bo tròn 2 đầu, chứa giá trị số, phép tính hoặc số đo đọc từ cảm biến, động cơ, biến.'
  },
  {
    id: 'boolean',
    nameVi: 'Khối Boolean Đúng/Sai (Boolean Blocks)',
    nameEn: 'Boolean Block',
    color: '#28A745',
    sampleText: '< ( ) < (100) > / < < > and < > >',
    description: 'Hình lục giác nhọn 2 đầu, trả về True (Đúng) hoặc False (Sai), dùng lắp vào ô lục giác của khối If hoặc Wait Until.'
  },
  {
    id: 'cap',
    nameVi: 'Khối kết thúc (Cap Blocks)',
    nameEn: 'Cap Block',
    color: '#FFAB19',
    sampleText: 'stop [all]',
    description: 'Có khấc ở phía trên và đáy phẳng, dùng để kết thúc chuỗi lệnh (không gắn thêm khối nào bên dưới được).'
  }
];

// 10 Nhóm Khối lệnh mặc định (Core Categories) trên cột trái của https://spike.legoeducation.com/prime/project
export const SPIKE_CORE_CATEGORIES = [
  { id: 'motors', nameEn: 'Motors', nameVi: '1. Động cơ', color: '#0090FF', isExtension: false },
  { id: 'movement', nameEn: 'Movement', nameVi: '2. Di chuyển', color: '#EA3396', isExtension: false },
  { id: 'light', nameEn: 'Light', nameVi: '3. Đèn', color: '#7C4DFF', isExtension: false },
  { id: 'sound', nameEn: 'Sound', nameVi: '4. Âm thanh', color: '#B548C6', isExtension: false },
  { id: 'events', nameEn: 'Events', nameVi: '5. Sự kiện', color: '#E6A800', isExtension: false },
  { id: 'control', nameEn: 'Control', nameVi: '6. Điều khiển', color: '#FFAB19', isExtension: false },
  { id: 'sensors', nameEn: 'Sensors', nameVi: '7. Cảm biến', color: '#0EB8D6', isExtension: false },
  { id: 'operators', nameEn: 'Operators', nameVi: '8. Phép toán', color: '#28A745', isExtension: false },
  { id: 'variables', nameEn: 'Variables', nameVi: '9. Biến & Danh sách', color: '#FF8C1A', isExtension: false },
  { id: 'my_blocks', nameEn: 'My Blocks', nameVi: '9.14. Khối của tôi', color: '#FF6680', isExtension: false }
];

// 8 Phần mở rộng (Block Extensions) chính thức trong SPIKE Prime Web App (Mở bằng nút dấu + ở góc dưới trái)
export const SPIKE_EXTENSIONS = [
  {
    id: 'more_motors',
    nameEn: 'More Motors',
    nameVi: '11. Động cơ mở rộng',
    color: '#0090FF',
    isExtension: true,
    description: 'Điều khiển vị trí tương đối (relative position), công suất động cơ (% power), chế độ phanh (brake/hold/coast) và gia tốc.'
  },
  {
    id: 'more_movement',
    nameEn: 'More Movement',
    nameVi: '12. Di chuyển mở rộng',
    color: '#EA3396',
    isExtension: true,
    description: 'Điều khiển tốc độ độc lập 2 bánh xe (Tank Drive: start moving at 50 50 % speed), cài đặt phanh và gia tốc xe robot.'
  },
  {
    id: 'more_sensors',
    nameEn: 'More Sensors',
    nameVi: '13. Cảm biến mở rộng',
    color: '#0EB8D6',
    isExtension: true,
    description: 'Đọc giá trị màu thô RGB (raw red/green/blue 0-255), gia tốc 3 trục (acceleration x/y/z), vận tốc góc (angular velocity).'
  },
  {
    id: 'music',
    nameEn: 'Music',
    nameVi: '14. Âm nhạc',
    color: '#0F9D8A',
    isExtension: true,
    description: 'Đánh trống (play drum), chơi nốt nhạc theo phách (play note for beats), chọn nhạc cụ (Piano, Synth...) và nhịp độ (tempo).'
  },
  {
    id: 'line_graph',
    nameEn: 'Line Graph',
    nameVi: '15. Biểu đồ đường (Data Logging)',
    color: '#0F9D8A',
    isExtension: true,
    description: 'Ghi và vẽ đồ thị dữ liệu cảm biến theo thời gian thực (plot value on line, show line graph fullscreen).'
  },
  {
    id: 'bar_graph',
    nameEn: 'Bar Graph',
    nameVi: '16. Biểu đồ cột',
    color: '#0F9D8A',
    isExtension: true,
    description: 'Biểu diễn và so sánh dữ liệu thống kê bằng biểu đồ cột trực quan trên màn hình.'
  },
  {
    id: 'display',
    nameEn: 'Display',
    nameVi: '17. Màn hình hiển thị',
    color: '#0F9D8A',
    isExtension: true,
    description: 'Hiển thị chữ và hình ảnh minh họa lên cửa sổ màn hình máy tính (write on Display, set image to Beach).'
  },
  {
    id: 'weather',
    nameEn: 'Weather',
    nameVi: '10. Dự báo Thời tiết',
    color: '#0F9D8A',
    isExtension: true,
    description: 'Lấy dữ liệu nhiệt độ, tốc độ gió, lượng mưa dự báo tại các thành phố trên thế giới (set location to Billund).'
  }
];

export const SPIKE_CATEGORIES = [...SPIKE_CORE_CATEGORIES, ...SPIKE_EXTENSIONS];

// 5 Cơ cấu Robot chuẩn (Official Mechanisms & Models) trong chương trình LEGO Education SPIKE Prime
export const OFFICIAL_SPIKE_MECHANISMS = [
  {
    id: 'driving_base_1',
    name: 'Driving Base 1 (Xe Robot Cơ Bản - 2 Bánh + Bánh Cầu)',
    unit: 'Competition Ready - Training Camp 1',
    actuators: 'Port A (Left Medium Motor) + Port B (Right Medium Motor)',
    sensors: 'Internal 6-Axis Gyro Sensor (Yaw / Pitch / Roll)',
    gearMechanism: 'Truyền động trực tiếp 1:1 (Direct Drive) vào bánh xe 56mm (1 vòng quay = 17.5 cm).',
    keyBlocks: ['set_movement_motors', 'move_for_duration', 'move_with_steering', 'set_yaw_angle_to_0'],
    description: 'Cơ cấu vi sai 2 bánh (Differential Drive): Khi 2 bánh quay cùng chiều, robot đi thẳng; khi 2 bánh quay ngược chiều (steering = 100 hoặc -100), robot xoay quanh tâm.'
  },
  {
    id: 'driving_base_2',
    name: 'Driving Base 2 (Xe Robot Tích Hợp Cụm Cảm Biến Kép)',
    unit: 'Competition Ready - Training Camp 2',
    actuators: 'Port A + Port B (Medium Motors)',
    sensors: 'Port D (Color Sensor hướng xuống sàn) + Port E (Distance Sensor hướng thẳng) + Port F (Force Sensor cản trước)',
    gearMechanism: 'Giá đỡ cảm biến cách mặt sàn 10mm giúp tối ưu độ phản xạ ánh sáng (Reflected Light) khi dò line đen.',
    keyBlocks: ['repeat_loop_line_follow', 'wait_until_sensor', 'when_color_is', 'when_pressed'],
    description: 'Dùng cho các nhiệm vụ tự hành: bám theo vạch đen trên sa bàn thi đấu, dừng tự động khi gặp chướng ngại vật hoặc khi chạm tường.'
  },
  {
    id: 'driving_base_3_dozer',
    name: 'Driving Base 3 + Dozer Blade / Lift Arm (Xe Robot Thi Đấu FLL + Tay Nâng 3D)',
    unit: 'Competition Ready - Guided Mission (Core 45678 + Expansion 45681)',
    actuators: 'Port A+B (Bánh xe lớn 88mm) + Port C (Large Angular Motor điều khiển tay nâng/ủi)',
    sensors: 'Dual Color Sensors + Gyro Yaw',
    gearMechanism: 'Hệ bánh răng giảm tốc 12T:36T (Tỷ số truyền 1:3) nối với Động cơ Lớn cổng C giúp tăng mô-men xoắn gấp 3 lần để nâng kiện hàng nặng.',
    keyBlocks: ['motor_go_to_position', 'motor_run_for_duration', 'more_motor_go_relative', 'more_movement_tank'],
    description: 'Cơ cấu mô-đun tháo lắp nhanh (Modular Attachment): Biến chuyển động quay của động cơ C thành chuyển động nâng/hạ cần cẩu hoặc đóng/mở gầu ủi trong không gian 3D.'
  },
  {
    id: 'super_cleanup_grabber',
    name: 'Super Cleanup Grabber (Cơ Cấu Tay Kẹp Liên Kết 4 Khâu)',
    unit: 'Invention Squad - Engineering Design',
    actuators: 'Port C (Large Motor) điều khiển ngón kẹp cao su đối xứng',
    sensors: 'Port F (Force Sensor) làm công tắc hành trình cảm nhận lực kẹp',
    gearMechanism: 'Cặp bánh răng ăn khớp ngược chiều + Cơ cấu thanh truyền 4 khâu (Four-bar Linkage) giúp 2 ngón kẹp khép vào đồng thời.',
    keyBlocks: ['more_motor_go_relative', 'motor_set_stop_mode', 'motor_set_speed'],
    description: 'Chuyên dùng để gắp, giữ chặt (chế độ Hold Position) và di chuyển các vật thể hình trụ hoặc khối năng lượng trong không gian 3D.'
  },
  {
    id: 'hopper_walker',
    name: 'Hopper & Kiki (Cơ Cấu Chân Bước Cam & Máy Phân Loại Màu)',
    unit: 'Invention Squad & Kickstart a Business',
    actuators: '2x Medium Motors quay trục Cam lệch tâm',
    sensors: 'Color Sensor (Port D) + Distance Sensor (Port E)',
    gearMechanism: 'Cơ cấu Cam lệch tâm & Tay biên (Crank-Rocker Mechanism) biến chuyển động tròn liên tục thành bước nhảy tiến về phía trước.',
    keyBlocks: ['when_color_is', 'light_matrix_turn_on', 'play_beep_for_seconds'],
    description: 'Giúp học sinh hiểu cách biến chuyển động quay của động cơ thành chuyển động tịnh tiến/nhảy mà không cần dùng bánh xe.'
  }
];

export const BUILDING_PARTS = [
  {
    id: 'hub_prime',
    name: 'SPIKE™ Prime Technic Large Hub',
    set: 'Bộ chuẩn 45678',
    color: '#FFD500',
    role: 'Trung tâm điều khiển: Màn hình 5x5 Light Matrix, 6-axis Gyro Sensor (Pitch/Roll/Yaw), Speaker, Center Power Button RGB & 6 cổng I/O (A-F).',
    tips: 'Đặt Hub nằm ngang cân bằng để cảm biến góc Yaw đo góc rẽ chính xác nhất.'
  },
  {
    id: 'frame_11x15',
    name: 'Khung Technic 11x15 & 7x11 (Magenta / Cyan)',
    set: 'Bộ chuẩn 45678',
    color: '#EA3396',
    role: 'Khung sườn chịu lực chính (Driving Base Chassis) để cố định Hub và 2 động cơ bánh xe.',
    tips: 'Dùng chốt Pin đen có ma sát để khóa cứng khung với động cơ A và B.'
  },
  {
    id: 'wheel_56_88',
    name: 'Bánh xe 56mm (17.5cm/vòng) & Bánh lớn 88mm (27.6cm/vòng)',
    set: '45678 + 45681',
    color: '#0090FF',
    role: 'Bánh 56mm chuẩn dùng khối "set 1 motor rotation to 17.5 cm moved". Bánh 88mm giúp tăng tốc độ di chuyển trên bàn thi đấu.',
    tips: 'Gắn đối xứng vào cổng A (Trái) và cổng B (Phải).'
  },
  {
    id: 'caster_ball',
    name: 'Bánh cầu đa hướng (Caster Wheel)',
    set: 'Bộ chuẩn 45678',
    color: '#94A3B8',
    role: 'Điểm tựa thứ 3 giúp Driving Base cân bằng và xoay tại chỗ (steering 100 / -100) mượt mà.',
    tips: 'Lắp phía sau đáy khung, độ cao ngang bằng trục bánh xe chính.'
  },
  {
    id: 'gear_turntable',
    name: 'Hệ thống Bánh răng (12T, 20T, 36T) & Mâm xoay lớn',
    set: 'Bộ mở rộng 45681',
    color: '#FF8C1A',
    role: 'Truyền động cơ khí cho Động cơ Cổng C: biến chuyển động quay thành nâng/hạ cần cẩu hoặc đóng/mở tay kẹp 3D.',
    tips: 'Dùng cặp bánh răng 12T kéo 36T giúp tăng lực nâng tay gắp lên gấp 3 lần.'
  },
  {
    id: 'sensor_bracket',
    name: 'Giá đỡ Color Sensor (D), Distance Sensor (E) & Force Sensor (F)',
    set: 'Bộ chuẩn 45678',
    color: '#0EB8D6',
    role: 'Giữ Color Sensor hướng xuống mặt bàn (~1cm) để đọc Reflected Light, và Distance Sensor hướng thẳng về phía trước.',
    tips: 'Khoảng cách 8-12mm từ mắt cảm biến màu xuống mặt bàn cho độ chính xác cao nhất.'
  }
];

export const BUILD_STEPS = [
  {
    step: 1,
    title: 'Bước 1: Lắp Khung Driving Base & 2 Động Cơ Dẫn Động (Port A & B)',
    parts: ['Khung Technic 11x15 Magenta', '2x Medium Angular Motor', '8x Chốt Pin đen có ma sát'],
    instruction: 'Gắn 2 Động cơ Vừa đối xứng hai bên khung chữ H. Động cơ bên trái nối vào Port A, động cơ bên phải nối vào Port B (dùng lệnh "set movement motors to A+B").',
    highlight: 'chassis'
  },
  {
    step: 2,
    title: 'Bước 2: Lắp Bánh Xe 56mm & Hiệu Chỉnh Chu Vi 17.5 cm',
    parts: ['2x Bánh xe Cyan 56mm', '1x Bánh cầu sắt tự lựa (Caster)', 'Thanh dầm Beam 7 lỗ'],
    instruction: 'Lắp 2 bánh xe vào trục động cơ A và B. Mỗi vòng quay (1 rotation) của bánh xe 56mm tương ứng quãng đường 17.5 cm.',
    highlight: 'wheels'
  },
  {
    step: 3,
    title: 'Bước 3: Đặt Bộ Não SPIKE Prime Hub Lên Khung',
    parts: ['1x SPIKE Prime Hub màu vàng', '4x Chốt khóa nhanh hai đầu'],
    instruction: 'Đặt Hub nằm ngang ngay phía trên trục bánh xe, mặt màn hình 5x5 Light Matrix hướng lên trên ("top" orientation).',
    highlight: 'hub'
  },
  {
    step: 4,
    title: 'Bước 4: Gắn Color Sensor (D), Distance Sensor (E) & Force Sensor (F)',
    parts: ['Color Sensor (Port D)', 'Distance Sensor (Port E)', 'Force Sensor (Port F)'],
    instruction: 'Gắn Color Sensor hướng xuống mặt thảm để dò line đen; gắn Distance Sensor nhìn về phía trước để đo khoảng cách vật cản.',
    highlight: 'sensors'
  },
  {
    step: 5,
    title: 'Bước 5: Lắp Cơ Cấu Tay Nâng Hạ & Gắp Vật Thể 3D (Port C)',
    parts: ['1x Large Angular Motor (Port C)', 'Cặp bánh răng 12T - 36T (Bộ mở rộng)', '2x Thanh dầm tay kẹp 9 lỗ'],
    instruction: 'Gắn Động cơ Lớn vào mũi Robot (Port C) để điều khiển nâng/hạ và kẹp kiện hàng trong không gian 3D.',
    highlight: 'arm'
  }
];

export const LED_PATTERNS = {
  SMILE: [
    [0,9,0,9,0],
    [0,9,0,9,0],
    [0,0,0,0,0],
    [9,0,0,0,9],
    [0,9,9,9,0]
  ],
  HEART: [
    [0,9,0,9,0],
    [9,9,9,9,9],
    [9,9,9,9,9],
    [0,9,9,9,0],
    [0,0,9,0,0]
  ],
  ARROW_UP: [
    [0,0,9,0,0],
    [0,9,9,9,0],
    [9,0,9,0,9],
    [0,0,9,0,0],
    [0,0,9,0,0]
  ],
  YES: [
    [0,0,0,0,9],
    [0,0,0,9,0],
    [9,0,9,0,0],
    [0,9,0,0,0],
    [0,0,0,0,0]
  ],
  OFF: [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ]
};

// =========================================================================================
// ĐẦY ĐỦ BỘ KHỐI LỆNH CHỮ (WORD BLOCKS) TỪ TRANG https://spike.legoeducation.com/prime/project
// Từng khối lệnh đều là 1 phần tử độc lập đúng thứ tự chuẩn của LEGO Education SPIKE
// =========================================================================================
export const BLOCK_DEFINITIONS = {
  // ================= 1. MOTORS (MÀU XANH DƯƠNG #0090FF - MỤC 1.1 -> 1.7) =================
  motor_run_for_duration: {
    category: 'motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '1.1',
    nameEn: 'A run ↻ for 1 rotations',
    nameVi: 'Chạy động cơ trong một khoảng (Run Motor for Duration)',
    description: 'Làm một hoặc nhiều động cơ quay theo chiều kim đồng hồ (↻) hoặc ngược chiều kim đồng hồ (↺) trong số vòng quay (rotations), độ (degrees) hoặc giây (seconds).',
    defaultParams: { port: 'A', direction: 'clockwise', value: 1, unit: 'rotations' },
    pythonTemplate: (p) => {
      const sign = p.direction === 'clockwise' ? 1 : -1;
      const deg = p.unit === 'rotations' ? Math.round(p.value * 360) : p.unit === 'degrees' ? p.value : Math.round(p.value * 360);
      return `await motor.run_for_degrees(port.${p.port}, ${deg * sign}, 750)`;
    }
  },
  motor_go_to_position: {
    category: 'motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '1.2',
    nameEn: 'A go shortest path to position 0',
    nameVi: 'Đưa động cơ đến vị trí (Motor Go to Position)',
    description: 'Đưa động cơ đến một vị trí tuyệt đối từ 0 đến 359 độ theo đường ngắn nhất (shortest path), chiều kim đồng hồ hoặc ngược chiều kim đồng hồ.',
    defaultParams: { port: 'A', direction: 'shortest path', position: 0 },
    pythonTemplate: (p) => `await motor.run_to_absolute_position(port.${p.port}, ${p.position}, 750)`
  },
  motor_start: {
    category: 'motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '1.3',
    nameEn: 'A start motor ↻',
    nameVi: 'Khởi động động cơ (Start Motor)',
    description: 'Làm động cơ quay theo chiều kim đồng hồ hoặc ngược chiều kim đồng hồ mãi mãi cho đến khi có lệnh dừng.',
    defaultParams: { port: 'A', direction: 'clockwise' },
    pythonTemplate: (p) => `motor.run(port.${p.port}, ${p.direction === 'clockwise' ? 750 : -750})`
  },
  motor_stop: {
    category: 'motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '1.4',
    nameEn: 'A stop motor',
    nameVi: 'Dừng động cơ (Stop Motor)',
    description: 'Dừng động cơ đang chạy bằng cách phanh để nhanh chóng dừng hẳn.',
    defaultParams: { port: 'A' },
    pythonTemplate: (p) => `motor.stop(port.${p.port})`
  },
  motor_set_speed: {
    category: 'motors',
    shape: 'stack',
    color: '#0090FF',
    spacerTop: true,
    sectionCode: '1.5',
    nameEn: 'A set speed to 75 %',
    nameVi: 'Đặt tốc độ động cơ (Set Motor Speed)',
    description: 'Đặt tốc độ cho động cơ từ -100% đến 100%. Mặc định là 75%.',
    defaultParams: { port: 'A', speed: 75 },
    pythonTemplate: (p) => `# Set motor ${p.port} default speed to ${p.speed}%`
  },
  motor_position: {
    category: 'motors',
    shape: 'reporter',
    color: '#0090FF',
    spacerTop: true,
    sectionCode: '1.6',
    nameEn: 'A position',
    nameVi: 'Vị trí của động cơ (Motor Position)',
    description: 'Khối báo giá trị (Reporter): Trả về vị trí tuyệt đối hiện tại (0° - 359°) của động cơ đang chọn.',
    defaultParams: { port: 'A' },
    pythonTemplate: (p) => `# motor.absolute_position(port.${p.port})`
  },
  motor_speed: {
    category: 'motors',
    shape: 'reporter',
    color: '#0090FF',
    sectionCode: '1.7',
    nameEn: 'A speed',
    nameVi: 'Tốc độ của động cơ (Motor Speed)',
    description: 'Khối báo giá trị (Reporter): Trả về tốc độ thực tế hiện tại (%) của động cơ.',
    defaultParams: { port: 'A' },
    pythonTemplate: (p) => `# motor.velocity(port.${p.port})`
  },

  // ================= 2. MOVEMENT (MÀU HỒNG #EA3396 - MỤC 2.1 -> 2.8) =================
  move_for_duration: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.1',
    nameEn: 'move ↑ for 10 rotations',
    nameVi: 'Di chuyển trong một khoảng (Move for Duration)',
    description: 'Làm Xe robot (Driving Base) đi tiến (↑) hoặc lùi (↓) một quãng tính theo cm, in, seconds, degrees hoặc rotations.',
    defaultParams: { direction: 'forward', value: 10, unit: 'rotations' },
    pythonTemplate: (p) => {
      const sign = p.direction === 'forward' ? 1 : -1;
      const deg = p.unit === 'cm' ? Math.round(p.value * 20.5) : p.unit === 'rotations' ? Math.round(p.value * 360) : p.value;
      return `await motor_pair.move_for_degrees(motor_pair.PAIR_1, ${deg * sign}, 0, velocity=500)`;
    }
  },
  start_moving: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.2',
    nameEn: 'start moving ↑',
    nameVi: 'Bắt đầu di chuyển (Start Moving)',
    description: 'Làm Xe robot bắt đầu đi tiến (↑) hoặc lùi (↓) liên tục.',
    defaultParams: { direction: 'forward' },
    pythonTemplate: (p) => `motor_pair.move(motor_pair.PAIR_1, 0, velocity=${p.direction === 'forward' ? 500 : -500})`
  },
  move_with_steering: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.3',
    nameEn: 'move right: 30 for 10 rotations',
    nameVi: 'Di chuyển có rẽ hướng trong một khoảng (Move with Steering for Duration)',
    description: 'Làm Xe robot di chuyển kèm góc lái (-100 đến 100). Giá trị 0 là đi thẳng, right: 100 hoặc left: -100 làm xe xoay tại chỗ.',
    defaultParams: { steeringText: 'right: 30', steering: 30, value: 10, unit: 'rotations' },
    pythonTemplate: (p) => {
      const deg = p.unit === 'rotations' ? Math.round(p.value * 360) : p.unit === 'degrees' ? p.value : Math.round(p.value * 20.5);
      return `await motor_pair.move_for_degrees(motor_pair.PAIR_1, ${deg}, ${p.steering}, velocity=500)`;
    }
  },
  start_moving_steering: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.4',
    nameEn: 'start moving right: 30',
    nameVi: 'Bắt đầu di chuyển có rẽ hướng (Start Moving with Steering)',
    description: 'Làm Xe robot bắt đầu đi tiến mãi mãi kèm góc lái (ví dụ right: 30).',
    defaultParams: { steering: 30 },
    pythonTemplate: (p) => `motor_pair.move(motor_pair.PAIR_1, ${p.steering}, velocity=500)`
  },
  stop_moving: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.5',
    nameEn: 'stop moving',
    nameVi: 'Dừng di chuyển (Stop Moving)',
    description: 'Dừng mọi chuyển động của Xe robot bằng cách phanh các động cơ.',
    defaultParams: {},
    pythonTemplate: () => `motor_pair.stop(motor_pair.PAIR_1)`
  },
  set_movement_speed: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    spacerTop: true,
    sectionCode: '2.6',
    nameEn: 'set movement speed to 50 %',
    nameVi: 'Đặt tốc độ di chuyển (Set Movement Speed)',
    description: 'Đặt tốc độ di chuyển của Xe robot từ -100% đến 100%. Giá trị mặc định là 50%.',
    defaultParams: { speed: 50 },
    pythonTemplate: (p) => `# Set movement speed to ${p.speed}%`
  },
  set_movement_motors: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.7',
    nameEn: 'set movement motors to A+B',
    nameVi: 'Đặt động cơ di chuyển (Set Movement Motors)',
    description: 'Xác định 2 Cổng (Port) mà 2 động cơ dẫn động bánh xe được nối vào (mặc định A+B).',
    defaultParams: { ports: 'A+B' },
    pythonTemplate: (p) => {
      const [left, right] = (p.ports || 'A+B').split('+');
      return `motor_pair.pair(motor_pair.PAIR_1, port.${left || 'A'}, port.${right || 'B'})`;
    }
  },
  set_motor_rotation_distance: {
    category: 'movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '2.8',
    nameEn: 'set 1 motor rotation to 17.5 cm moved',
    nameVi: 'Đặt 1 vòng quay động cơ ứng với quãng đường',
    description: 'Hiệu chỉnh quãng đường của Xe robot (bánh xe chuẩn 56mm = 17.5 cm / 1 vòng quay).',
    defaultParams: { distance: 17.5, unit: 'cm' },
    pythonTemplate: (p) => `# Calibration: 1 rotation = ${p.distance} ${p.unit}`
  },

  // ================= 3. LIGHT (MÀU TÍM ĐẬM #7C4DFF - MỤC 3.1 -> 3.17) =================
  light_matrix_turn_on_for_seconds: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.1',
    nameEn: 'turn on [5x5] for 2 seconds',
    nameVi: 'Bật Ma trận đèn 5x5 trong số giây (Turn On 5x5 Light Matrix for Seconds)',
    description: 'Làm sáng hình mẫu trên ma trận đèn 5x5 trong khoảng thời gian được chỉ định rồi tắt.',
    defaultParams: { pattern: 'SMILE', seconds: 2 },
    pythonTemplate: (p) => `light_matrix.show_image(light_matrix.IMAGE_${p.pattern})\n    await runloop.sleep_ms(${Math.round(p.seconds * 1000)})`
  },
  light_matrix_turn_on: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.2',
    nameEn: 'turn on [5x5]',
    nameVi: 'Bật Ma trận đèn 5x5 (Turn On 5x5 Light Matrix)',
    description: 'Làm hình mẫu sáng liên tục trên ma trận đèn 5x5 của Hub.',
    defaultParams: { pattern: 'HEART' },
    pythonTemplate: (p) => `light_matrix.show_image(light_matrix.IMAGE_${p.pattern})`
  },
  light_matrix_write: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.3',
    nameEn: 'write Hello',
    nameVi: 'Viết lên Ma trận đèn 5x5 (Write on 5x5 Light Matrix)',
    description: 'Hiển thị chuỗi chữ chạy ngang qua màn hình ma trận đèn 5x5.',
    defaultParams: { text: 'Hello' },
    pythonTemplate: (p) => `await light_matrix.write("${p.text}")`
  },
  light_matrix_turn_off: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.4',
    nameEn: 'turn off pixels',
    nameVi: 'Tắt Ma trận đèn 5x5 (Turn off 5x5 Light Matrix)',
    description: 'Tắt toàn bộ 25 bóng đèn trên ma trận 5x5.',
    defaultParams: {},
    pythonTemplate: () => `light_matrix.clear()`
  },
  light_matrix_set_brightness: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    spacerTop: true,
    sectionCode: '3.5',
    nameEn: 'set pixel brightness to 100 %',
    nameVi: 'Đặt độ sáng điểm ảnh trên Ma trận 5x5 (Set Pixel Brightness)',
    description: 'Đặt độ sáng mặc định (0% - 100%) cho các bóng đèn trên ma trận 5x5.',
    defaultParams: { brightness: 100 },
    pythonTemplate: (p) => `# Set 5x5 matrix brightness to ${p.brightness}%`
  },
  light_matrix_set_pixel: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.6',
    nameEn: 'set pixel at 1 , 1 to 100 %',
    nameVi: 'Đặt độ sáng 1 điểm trên Ma trận 5x5 (Set Single Pixel)',
    description: 'Đặt độ sáng (0-100%) của một điểm ảnh (pixel) tại cột X (1-5), hàng Y (1-5) trên ma trận 5x5.',
    defaultParams: { x: 1, y: 1, brightness: 100 },
    pythonTemplate: (p) => `light_matrix.set_pixel(${p.x - 1}, ${p.y - 1}, ${p.brightness})`
  },
  light_matrix_rotate: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    spacerTop: true,
    sectionCode: '3.7',
    nameEn: 'rotate orientation clockwise',
    nameVi: 'Xoay hướng hiển thị Ma trận 5x5 (Rotate Orientation)',
    description: 'Xoay chiều hiển thị trên ma trận đèn 5x5 theo chiều kim đồng hồ hoặc ngược chiều kim đồng hồ 90 độ.',
    defaultParams: { direction: 'clockwise' },
    pythonTemplate: (p) => `# Rotate 5x5 matrix ${p.direction}`
  },
  light_matrix_set_orientation: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    sectionCode: '3.8',
    nameEn: 'set orientation to upright',
    nameVi: 'Đặt hướng hiển thị Ma trận 5x5 (Set Matrix Orientation)',
    description: 'Đặt chiều hiển thị của ma trận 5x5: upright (thẳng đứng), left, right, upside down.',
    defaultParams: { orientation: 'upright' },
    pythonTemplate: (p) => `# Set 5x5 matrix orientation to ${p.orientation}`
  },
  set_center_button_light: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    spacerTop: true,
    sectionCode: '3.16',
    nameEn: 'set Center Button light to red',
    nameVi: 'Đặt màu đèn Nút giữa (Set Center Button Light)',
    description: 'Đặt màu cho đèn của Nút giữa (Nút nguồn) trên Hub.',
    defaultParams: { color: 'RED' },
    pythonTemplate: (p) => `# Set Center Button light to ${p.color}`
  },
  light_up_distance_sensor: {
    category: 'light',
    shape: 'stack',
    color: '#7C4DFF',
    spacerTop: true,
    sectionCode: '3.17',
    nameEn: 'E light up ◯ ◯',
    nameVi: 'Bật đèn Cảm biến khoảng cách (Light up Distance Sensor)',
    description: 'Bật và tắt 4 đèn LED xung quanh mắt của Cảm biến khoảng cách.',
    defaultParams: { port: 'E', mode: 'all 4 lights' },
    pythonTemplate: (p) => `distance_sensor.show(port.${p.port}, [100, 100, 100, 100])`
  },

  // ================= 4. SOUND (MÀU TÍM HỒNG #B548C6 - MỤC 4.1 -> 4.11) =================
  play_sound_until_done: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.1',
    nameEn: 'play sound Cat Meow 1 until done',
    nameVi: 'Phát âm thanh cho đến hết (Play Sound until Done)',
    description: 'Phát một hiệu ứng âm thanh đã chọn và chờ cho đến khi phát xong.',
    defaultParams: { soundName: 'Cat Meow 1' },
    pythonTemplate: (p) => `# Play device sound "${p.soundName}" until done`
  },
  start_sound: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.2',
    nameEn: 'start sound Cat Meow 1',
    nameVi: 'Bắt đầu phát âm thanh (Start Sound)',
    description: 'Bắt đầu phát hiệu ứng âm thanh và chuyển ngay sang khối lệnh tiếp theo.',
    defaultParams: { soundName: 'Cat Meow 1' },
    pythonTemplate: (p) => `# Start device sound "${p.soundName}"`
  },
  play_beep_for_seconds: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    spacerTop: true,
    sectionCode: '4.3',
    nameEn: 'play beep 60 for 0.2 seconds',
    nameVi: 'Phát tiếng bíp trong số giây (Play Beep for Seconds)',
    description: 'Phát tiếng bíp trên Hub với nốt nhạc (note) trong số giây được chỉ định.',
    defaultParams: { note: 60, seconds: 0.2 },
    pythonTemplate: (p) => `await sound.beep(${p.note * 7}, ${Math.round(p.seconds * 1000)}, 100)`
  },
  start_playing_beep: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.4',
    nameEn: 'start playing beep 60',
    nameVi: 'Bắt đầu phát tiếng bíp (Start Playing Beep)',
    description: 'Bắt đầu phát tiếng bíp liên tục trên Hub cho đến khi có lệnh dừng âm thanh.',
    defaultParams: { note: 60 },
    pythonTemplate: (p) => `sound.beep(${p.note * 7}, 10000, 100)`
  },
  stop_all_sounds: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    spacerTop: true,
    sectionCode: '4.5',
    nameEn: 'stop all sounds',
    nameVi: 'Dừng mọi âm thanh (Stop All Sounds)',
    description: 'Dừng tất cả âm thanh đang phát trên Hub và thiết bị.',
    defaultParams: {},
    pythonTemplate: () => `sound.stop()`
  },
  change_sound_effect: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    spacerTop: true,
    sectionCode: '4.6',
    nameEn: 'change pitch effect by 10',
    nameVi: 'Thay đổi hiệu ứng âm thanh (Change Sound Effect By)',
    description: 'Thay đổi hiệu ứng cao độ (pitch) hoặc pan left/right của âm thanh.',
    defaultParams: { effect: 'pitch', value: 10 },
    pythonTemplate: (p) => `# Change sound ${p.effect} effect by ${p.value}`
  },
  set_sound_effect: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.7',
    nameEn: 'set pitch effect to 100',
    nameVi: 'Đặt hiệu ứng âm thanh (Set Sound Effect To)',
    description: 'Đặt hiệu ứng cao độ (pitch) hoặc pan left/right về giá trị xác định.',
    defaultParams: { effect: 'pitch', value: 100 },
    pythonTemplate: (p) => `# Set sound ${p.effect} effect to ${p.value}`
  },
  clear_sound_effects: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.8',
    nameEn: 'clear sound effects',
    nameVi: 'Xóa hiệu ứng âm thanh (Clear Sound Effects)',
    description: 'Đặt lại mọi hiệu ứng âm thanh về mặc định.',
    defaultParams: {},
    pythonTemplate: () => `# Clear sound effects`
  },
  change_volume_by: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    spacerTop: true,
    sectionCode: '4.9',
    nameEn: 'change volume by -10',
    nameVi: 'Thay đổi âm lượng một lượng (Change Volume By)',
    description: 'Tăng hoặc giảm âm lượng phát âm thanh.',
    defaultParams: { delta: -10 },
    pythonTemplate: (p) => `# Change volume by ${p.delta}`
  },
  set_volume_to: {
    category: 'sound',
    shape: 'stack',
    color: '#B548C6',
    sectionCode: '4.10',
    nameEn: 'set volume to 100 %',
    nameVi: 'Đặt âm lượng (Set Volume)',
    description: 'Đặt âm lượng phát âm thanh từ 0% đến 100%.',
    defaultParams: { volume: 100 },
    pythonTemplate: (p) => `# Set sound volume to ${p.volume}%`
  },
  sound_volume: {
    category: 'sound',
    shape: 'reporter',
    color: '#B548C6',
    sectionCode: '4.11',
    nameEn: 'volume',
    nameVi: 'Âm lượng hiện tại (Volume Reporter)',
    description: 'Khối báo giá trị (Reporter): Trả về mức âm lượng hiện tại (0 - 100%).',
    defaultParams: {},
    pythonTemplate: () => `# volume`
  },

  // ================= 5. EVENTS (MÀU VÀNG #E6A800 - MỤC 5.1 -> 5.13) =================
  when_program_starts: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    sectionCode: '5.1',
    nameEn: 'when program starts',
    nameVi: 'Khi chương trình bắt đầu (When Program Starts)',
    description: 'Khi chương trình bắt đầu, khối mũ này sẽ chạy lần lượt tất cả các khối gắn bên dưới nó, từ trên xuống dưới.',
    defaultParams: {},
    pythonTemplate: () => `# Event: when program starts`
  },
  when_color_is: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.2',
    nameEn: 'A when color is red',
    nameVi: 'Khi màu là (When Color Is)',
    description: 'Chạy các khối bên dưới khi Cảm biến màu phát hiện màu được chỉ định.',
    defaultParams: { port: 'D', color: 'RED' },
    pythonTemplate: (p) => `# Event: when ${p.port} color is ${p.color}`
  },
  when_pressed: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.3',
    nameEn: 'A when pressed',
    nameVi: 'Khi lực nhấn là (When Pressure Is)',
    description: 'Chạy các khối gắn bên dưới khi Cảm biến lực được nhấn (pressed), nhấn mạnh (hard-pressed) hoặc thả ra (released).',
    defaultParams: { port: 'F', state: 'pressed' },
    pythonTemplate: (p) => `# Event: when ${p.port} is ${p.state}`
  },
  when_closer_than: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.4',
    nameEn: 'A when closer than 15 %',
    nameVi: 'Khi gần hơn (When Closer Than)',
    description: 'Chạy các khối bên dưới khi Cảm biến khoảng cách phát hiện vật ở gần hơn hoặc xa hơn khoảng cách chỉ định.',
    defaultParams: { port: 'E', comparator: 'closer than', value: 15, unit: '%' },
    pythonTemplate: (p) => `# Event: when ${p.port} ${p.comparator} ${p.value} ${p.unit}`
  },
  when_tilted_dir: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.5',
    nameEn: 'when tilted any',
    nameVi: 'Khi Hub bị nghiêng (When Tilted)',
    description: 'Chạy các khối bên dưới khi Hub bị nghiêng theo hướng chỉ định.',
    defaultParams: { direction: 'any' },
    pythonTemplate: (p) => `# Event: when tilted ${p.direction}`
  },
  when_tilted: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    sectionCode: '5.6',
    nameEn: 'when front is up',
    nameVi: 'Khi mặt Hub hướng lên (When Hub Orientation Is Up)',
    description: 'Chạy các khối bên dưới khi Hub được đặt theo hướng front, back, top, bottom, left side, right side.',
    defaultParams: { side: 'front' },
    pythonTemplate: (p) => `# Event: when ${p.side} is up`
  },
  when_shaken: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    sectionCode: '5.7',
    nameEn: 'when shaken',
    nameVi: 'Khi Hub bị lắc / gõ nhẹ / rơi (When Hub Gesture)',
    description: 'Chạy các khối bên dưới khi Hub bị lắc (shaken), bị gõ nhẹ (tapped) hoặc bị rơi (falling).',
    defaultParams: { gesture: 'shaken' },
    pythonTemplate: (p) => `# Event: when Hub ${p.gesture}`
  },
  when_hub_button: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.8',
    nameEn: 'when left Button pressed',
    nameVi: 'Khi nút trên Hub được nhấn (When Hub Button Pressed)',
    description: 'Chạy các khối gắn bên dưới khi Nút trái (left) hoặc Nút phải (right) trên Hub được nhấn hoặc thả ra.',
    defaultParams: { button: 'left', action: 'pressed' },
    pythonTemplate: (p) => `# Event: when ${p.button} Button ${p.action}`
  },
  when_timer_gt: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.9',
    nameEn: 'when timer > 10',
    nameVi: 'Khi đồng hồ đếm giờ lớn hơn (When Timer >)',
    description: 'Chạy các khối bên dưới khi bộ đếm thời gian vượt quá số giây chỉ định.',
    defaultParams: { seconds: 10 },
    pythonTemplate: (p) => `# Event: when timer > ${p.seconds}`
  },
  when_condition: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.10',
    nameEn: 'when < >',
    nameVi: 'Khi điều kiện Đúng (When Condition Is True)',
    description: 'Chạy các khối bên dưới ngay khi biểu thức Boolean gắn trong ô lục giác trở thành True.',
    defaultParams: {},
    pythonTemplate: () => `# Event: when <condition>`
  },
  when_i_receive: {
    category: 'events',
    shape: 'hat',
    color: '#E6A800',
    spacerTop: true,
    sectionCode: '5.11',
    nameEn: 'when I receive message1',
    nameVi: 'Khi nhận được tin nhắn (When I Receive Message)',
    description: 'Bắt đầu chạy chồng lệnh khi nhận được thông điệp phát ra từ khối broadcast.',
    defaultParams: { message: 'message1' },
    pythonTemplate: (p) => `# Event: when I receive "${p.message}"`
  },
  broadcast_message: {
    category: 'events',
    shape: 'stack',
    color: '#E6A800',
    sectionCode: '5.12',
    nameEn: 'broadcast message1',
    nameVi: 'Phát tin nhắn (Broadcast Message)',
    description: 'Phát đi một tin nhắn để kích hoạt đồng thời các chồng lệnh có khối mũ "when I receive [message1]".',
    defaultParams: { message: 'message1' },
    pythonTemplate: (p) => `# broadcast("${p.message}")`
  },
  broadcast_and_wait: {
    category: 'events',
    shape: 'stack',
    color: '#E6A800',
    sectionCode: '5.13',
    nameEn: 'broadcast message1 and wait',
    nameVi: 'Phát tin nhắn và chờ (Broadcast Message and Wait)',
    description: 'Phát tin nhắn và chờ cho đến khi tất cả các chồng lệnh nhận tin nhắn thực hiện xong.',
    defaultParams: { message: 'message1' },
    pythonTemplate: (p) => `# broadcast_and_wait("${p.message}")`
  },

  // ================= 6. CONTROL (MÀU CAM VÀNG #FFAB19 - MỤC 6.1 -> 6.9) =================
  wait_seconds: {
    category: 'control',
    shape: 'stack',
    color: '#FFAB19',
    sectionCode: '6.1',
    nameEn: 'wait 1 seconds',
    nameVi: 'Chờ trong số giây (Wait for Seconds)',
    description: 'Tạm dừng chồng lệnh trong một số giây được chỉ định.',
    defaultParams: { seconds: 1 },
    pythonTemplate: (p) => `await runloop.sleep_ms(${Math.round(p.seconds * 1000)})`
  },
  repeat_loop_line_follow: {
    category: 'control',
    shape: 'c_block',
    color: '#FFAB19',
    sectionCode: '6.2',
    nameEn: 'repeat 10',
    nameVi: 'Vòng lặp lặp lại (Repeat Loop - C Block)',
    description: 'Khối chữ C (C-Block): Lặp lại các lệnh bên trong một số lần được chỉ định.',
    defaultParams: { times: 10, action: 'line_follow_port_D' },
    pythonTemplate: (p) => `for _ in range(${p.times}):\n        err = color_sensor.reflection(port.D) - 50\n        motor_pair.move(motor_pair.PAIR_1, int(err * 1.2), velocity=450)\n        await runloop.sleep_ms(30)`
  },
  forever_loop: {
    category: 'control',
    shape: 'c_block',
    color: '#FFAB19',
    sectionCode: '6.3',
    nameEn: 'forever',
    nameVi: 'Vòng lặp mãi mãi (Forever Loop - C Block)',
    description: 'Khối chữ C lặp lại các lệnh bên trong liên tục cho đến khi nhấn Stop.',
    defaultParams: {},
    pythonTemplate: () => `while True:\n        await runloop.sleep_ms(50)`
  },
  if_then_block: {
    category: 'control',
    shape: 'c_block',
    color: '#FFAB19',
    spacerTop: true,
    sectionCode: '6.4',
    nameEn: 'if < > then',
    nameVi: 'Nếu ... thì ... (If Then - C Block)',
    description: 'Kiểm tra điều kiện Boolean: nếu Đúng thì thực hiện các khối nằm trong khe chữ C.',
    defaultParams: { port: 'D', color: 'RED' },
    pythonTemplate: (p) => `if color_sensor.color(port.${p.port}) == color.${p.color}:\n        await sound.beep(600, 200, 100)`
  },
  if_else_block: {
    category: 'control',
    shape: 'c_block',
    color: '#FFAB19',
    sectionCode: '6.5',
    nameEn: 'if < > then ... else',
    nameVi: 'Nếu ... thì ... nếu không thì ... (If Then Else - E Block)',
    description: 'Nếu điều kiện Đúng thì chạy nhánh trên, nếu Sai thì chạy nhánh else bên dưới.',
    defaultParams: {},
    pythonTemplate: () => `if True:\n        pass\n    else:\n        pass`
  },
  wait_until_sensor: {
    category: 'control',
    shape: 'stack',
    color: '#FFAB19',
    spacerTop: true,
    sectionCode: '6.6',
    nameEn: 'wait until < >',
    nameVi: 'Chờ cho đến khi (Wait Until)',
    description: 'Tạm dừng chồng lệnh cho đến khi điều kiện Boolean bên trong ô lục giác trở thành Đúng (True).',
    defaultParams: { port: 'E', condition: 'closer than', value: 25, unit: 'cm' },
    pythonTemplate: (p) => `while distance_sensor.distance(port.${p.port}) > ${p.value * 10}:\n        await runloop.sleep_ms(20)`
  },
  repeat_until_block: {
    category: 'control',
    shape: 'c_block',
    color: '#FFAB19',
    sectionCode: '6.7',
    nameEn: 'repeat until < >',
    nameVi: 'Lặp cho đến khi (Repeat Until - C Block)',
    description: 'Lặp lại các khối bên trong khe chữ C cho đến khi điều kiện Boolean trở thành Đúng.',
    defaultParams: {},
    pythonTemplate: () => `while not False:\n        await runloop.sleep_ms(20)`
  },
  stop_other_stacks: {
    category: 'control',
    shape: 'stack',
    color: '#FFAB19',
    spacerTop: true,
    sectionCode: '6.8',
    nameEn: 'stop other stacks',
    nameVi: 'Dừng các chồng lệnh khác (Stop Other Stacks)',
    description: 'Dừng tất cả các chồng lệnh khác trừ chồng lệnh chứa khối này.',
    defaultParams: {},
    pythonTemplate: () => `# Stop other running stacks`
  },
  stop_all_cap: {
    category: 'control',
    shape: 'cap',
    color: '#FFAB19',
    sectionCode: '6.9',
    nameEn: 'stop all',
    nameVi: 'Khối kết thúc: Dừng (Stop Cap Block)',
    description: 'Khối kết thúc (Cap Block - đáy phẳng): Dừng tất cả các chồng lệnh, chồng lệnh này hoặc thoát chương trình.',
    defaultParams: { target: 'all' },
    pythonTemplate: () => `raise SystemExit`
  },

  // ================= 7. SENSORS (MÀU XANH DA TRỜI #0EB8D6 - MỤC 7.1 -> 7.16) =================
  sensor_is_color: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    sectionCode: '7.1',
    nameEn: 'A is color red ?',
    nameVi: 'Cảm biến màu có phải là màu ... không? (Is Color ?)',
    description: 'Khối Boolean: Trả về True nếu Cảm biến màu phát hiện đúng màu được chọn.',
    defaultParams: { port: 'D', color: 'RED' },
    pythonTemplate: (p) => `color_sensor.color(port.${p.port}) == color.${p.color}`
  },
  sensor_color: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '7.2',
    nameEn: 'A color',
    nameVi: 'Màu sắc của Cảm biến màu (Color Reporter)',
    description: 'Khối Reporter: Trả về mã màu hiện tại mà Cảm biến màu đang nhìn thấy.',
    defaultParams: { port: 'D' },
    pythonTemplate: (p) => `color_sensor.color(port.${p.port})`
  },
  sensor_is_reflection: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    sectionCode: '7.3',
    nameEn: 'A reflection < 50 % ?',
    nameVi: 'Ánh sáng phản xạ có < 50% không? (Is Reflected Light ?)',
    description: 'Khối Boolean: So sánh cường độ ánh sáng phản xạ với ngưỡng % (dùng phát hiện vạch đen dò line).',
    defaultParams: { port: 'D', comp: '<', value: 50 },
    pythonTemplate: (p) => `color_sensor.reflection(port.${p.port}) ${p.comp} ${p.value}`
  },
  sensor_reflected_light: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '7.4',
    nameEn: 'A reflected light',
    nameVi: 'Cường độ ánh sáng phản xạ (Reflected Light 0-100%)',
    description: 'Khối Reporter: Trả về độ phản xạ ánh sáng từ 0% (đen) đến 100% (trắng).',
    defaultParams: { port: 'D' },
    pythonTemplate: (p) => `color_sensor.reflection(port.${p.port})`
  },
  sensor_is_pressed: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    spacerTop: true,
    sectionCode: '7.5',
    nameEn: 'A is pressed ?',
    nameVi: 'Cảm biến lực có đang được nhấn không? (Is Force Sensor Pressed ?)',
    description: 'Khối Boolean: Trả về True nếu Cảm biến lực đang được nhấn (pressed), nhấn mạnh (hard-pressed) hoặc thả ra (released).',
    defaultParams: { port: 'F', state: 'pressed' },
    pythonTemplate: (p) => `force_sensor.pressed(port.${p.port})`
  },
  sensor_pressure: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '7.6',
    nameEn: 'A pressure in %',
    nameVi: 'Lực nhấn trên Cảm biến lực (Pressure in % / N)',
    description: 'Khối Reporter: Trả về độ lớn lực nhấn theo % (0-100%) hoặc Newton (0-10 N).',
    defaultParams: { port: 'F', unit: '%' },
    pythonTemplate: (p) => `force_sensor.force(port.${p.port})`
  },
  sensor_is_closer_than: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    spacerTop: true,
    sectionCode: '7.7',
    nameEn: 'A is closer than 15 % ?',
    nameVi: 'Khoảng cách có gần hơn ... không? (Is Distance Closer Than ?)',
    description: 'Khối Boolean: Trả về True khi vật cản ở gần hơn hoặc xa hơn giá trị chỉ định (cm, %, inch).',
    defaultParams: { port: 'E', comp: 'closer than', value: 15, unit: '%' },
    pythonTemplate: (p) => `distance_sensor.distance(port.${p.port}) < ${p.value * 10}`
  },
  sensor_distance: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '7.8',
    nameEn: 'A distance in %',
    nameVi: 'Khoảng cách đo được (Distance in cm / % / in)',
    description: 'Khối Reporter: Trả về khoảng cách từ Cảm biến siêu âm tới vật cản.',
    defaultParams: { port: 'E', unit: 'cm' },
    pythonTemplate: (p) => `distance_sensor.distance(port.${p.port})`
  },
  sensor_is_tilted: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    spacerTop: true,
    sectionCode: '7.9',
    nameEn: 'is tilted any ?',
    nameVi: 'Hub có đang nghiêng không? (Is Hub Tilted ?)',
    description: 'Khối Boolean: Kiểm tra xem bộ não Hub có đang nghiêng theo hướng chỉ định không.',
    defaultParams: { dir: 'any' },
    pythonTemplate: () => `# is Hub tilted`
  },
  sensor_is_orientation: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    sectionCode: '7.10',
    nameEn: 'is front up ?',
    nameVi: 'Mặt của Hub có đang hướng lên không? (Is Orientation Up ?)',
    description: 'Khối Boolean: Kiểm tra mặt nào của Hub đang hướng lên trên (front, back, top, bottom, left side, right side).',
    defaultParams: { side: 'front' },
    pythonTemplate: () => `# is Hub orientation up`
  },
  sensor_is_shaken: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    sectionCode: '7.11',
    nameEn: 'is shaken ?',
    nameVi: 'Hub có bị lắc / gõ nhẹ / rơi không? (Is Hub Shaken ?)',
    description: 'Khối Boolean: Kiểm tra cử chỉ chuyển động của Hub (shaken, tapped, falling).',
    defaultParams: { gesture: 'shaken' },
    pythonTemplate: () => `# is Hub shaken`
  },
  sensor_angle: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '7.12',
    nameEn: 'pitch angle',
    nameVi: 'Góc nghiêng của Hub (Pitch / Roll / Yaw Angle)',
    description: 'Khối Reporter: Trả về góc Pitch (chúc/ngẩng), Roll (nghiêng trái/phải) hoặc Yaw (góc xoay hướng mũi robot).',
    defaultParams: { axis: 'pitch' },
    pythonTemplate: (p) => `motion_sensor.tilt_angles() # ${p.axis}`
  },
  set_yaw_angle_to_0: {
    category: 'sensors',
    shape: 'stack',
    color: '#0EB8D6',
    sectionCode: '7.13',
    nameEn: 'set yaw angle to 0',
    nameVi: 'Đặt góc xoay (yaw) của Hub về 0 (Set Hub Yaw Angle to 0)',
    description: 'Đặt góc xoay (yaw) của cảm biến con quay hồi chuyển trên Hub về 0 độ.',
    defaultParams: {},
    pythonTemplate: () => `motion_sensor.reset_yaw(0)`
  },
  sensor_is_button: {
    category: 'sensors',
    shape: 'boolean',
    color: '#0EB8D6',
    spacerTop: true,
    sectionCode: '7.14',
    nameEn: 'is left Button pressed ?',
    nameVi: 'Nút trên Hub có đang được nhấn không? (Is Hub Button Pressed ?)',
    description: 'Khối Boolean: Kiểm tra nút Trái (left) hoặc Phải (right) trên mặt Hub.',
    defaultParams: { button: 'left', state: 'pressed' },
    pythonTemplate: () => `# is Hub button pressed`
  },
  sensor_timer: {
    category: 'sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    spacerTop: true,
    sectionCode: '7.15',
    nameEn: 'timer',
    nameVi: 'Đồng hồ bấm giờ (Timer)',
    description: 'Khối Reporter: Trả về thời gian (giây) tính từ lúc chương trình bắt đầu hoặc từ lần reset timer gần nhất.',
    defaultParams: {},
    pythonTemplate: () => `# timer`
  },
  reset_timer: {
    category: 'sensors',
    shape: 'stack',
    color: '#0EB8D6',
    sectionCode: '7.16',
    nameEn: 'reset timer',
    nameVi: 'Đặt lại bộ đếm giờ (Reset Timer)',
    description: 'Đặt lại đồng hồ bấm giờ của chương trình về 0.0 giây.',
    defaultParams: {},
    pythonTemplate: () => `# Reset program timer to 0`
  },

  // ================= 8. OPERATORS (MÀU XANH LÁ #28A745 - ĐỦ 19 KHỐI NHƯ TRONG ẢNH SPIKE PRIME) =================
  op_random: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.1',
    nameEn: 'pick random 1 to 10',
    nameVi: 'Chọn số ngẫu nhiên (Pick Random)',
    description: 'Trả về một số ngẫu nhiên nằm trong khoảng từ số thứ nhất (1) đến số thứ hai (10), bao gồm cả hai đầu mút.',
    defaultParams: { from: 1, to: 10 },
    pythonTemplate: (p) => `random.randint(${p.from}, ${p.to})`
  },
  op_add: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.2',
    nameEn: '( ) + ( )',
    nameVi: 'Phép Cộng (Addition +)',
    description: 'Cộng hai giá trị số với nhau.',
    defaultParams: { a: '', b: '' },
    pythonTemplate: (p) => `(${p.a || 0} + ${p.b || 0})`
  },
  op_subtract: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.3',
    nameEn: '( ) - ( )',
    nameVi: 'Phép Trừ (Subtraction -)',
    description: 'Lấy số thứ nhất trừ đi số thứ hai (rất hay dùng tính sai số Error = Reflected Light - 50 khi dò line).',
    defaultParams: { a: '', b: '' },
    pythonTemplate: (p) => `(${p.a || 0} - ${p.b || 0})`
  },
  op_multiply: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.4',
    nameEn: '( ) * ( )',
    nameVi: 'Phép Nhân (Multiplication *)',
    description: 'Nhân hai giá trị số với nhau (ví dụ nhân sai số với hệ số Kp trong thuật toán PID dò line).',
    defaultParams: { a: '', b: '' },
    pythonTemplate: (p) => `(${p.a || 0} * ${p.b || 0})`
  },
  op_divide: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.5',
    nameEn: '( ) / ( )',
    nameVi: 'Phép Chia (Division /)',
    description: 'Lấy số thứ nhất chia cho số thứ hai.',
    defaultParams: { a: '', b: '' },
    pythonTemplate: (p) => `(${p.a || 0} / ${p.b || 1})`
  },
  op_lt: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.6',
    nameEn: '( ) < 100',
    nameVi: 'Nhỏ hơn (Less Than <)',
    description: 'Khối Boolean lục giác: Trả về True nếu giá trị bên trái nhỏ hơn giá trị bên phải (mặc định 100).',
    defaultParams: { a: '', b: 100 },
    pythonTemplate: (p) => `(${p.a || 0} < ${p.b})`
  },
  op_eq: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.7',
    nameEn: '( ) = 100',
    nameVi: 'Bằng nhau (Equal To =)',
    description: 'Khối Boolean lục giác: Trả về True nếu hai giá trị bằng nhau.',
    defaultParams: { a: '', b: 100 },
    pythonTemplate: (p) => `(${p.a || 0} == ${p.b})`
  },
  op_gt: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.8',
    nameEn: '( ) > 100',
    nameVi: 'Lớn hơn (Greater Than >)',
    description: 'Khối Boolean lục giác: Trả về True nếu giá trị bên trái lớn hơn giá trị bên phải (mặc định 100).',
    defaultParams: { a: '', b: 100 },
    pythonTemplate: (p) => `(${p.a || 0} > ${p.b})`
  },
  op_and: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.9',
    nameEn: '< > and < >',
    nameVi: 'Phép toán Logic VÀ (AND)',
    description: 'Khối Boolean lục giác: Trả về True khi CẢ HAI điều kiện lục giác bên trong đều Đúng.',
    defaultParams: {},
    pythonTemplate: () => `(cond1 and cond2)`
  },
  op_or: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.10',
    nameEn: '< > or < >',
    nameVi: 'Phép toán Logic HOẶC (OR)',
    description: 'Khối Boolean lục giác: Trả về True khi ÍT NHẤT MỘT trong hai điều kiện bên trong Đúng.',
    defaultParams: {},
    pythonTemplate: () => `(cond1 or cond2)`
  },
  op_not: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.11',
    nameEn: 'not < >',
    nameVi: 'Phép toán Logic KHÔNG / Phủ định (NOT)',
    description: 'Khối Boolean lục giác: Đảo ngược giá trị Đúng thành Sai và Sai thành Đúng.',
    defaultParams: {},
    pythonTemplate: () => `(not cond)`
  },
  op_between: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.12',
    nameEn: 'is 0 in between -10 and 10 ?',
    nameVi: 'Kiểm tra nằm trong khoảng (Is In Between ?)',
    description: 'Khối Boolean đặc trưng của SPIKE Prime: Trả về True nếu số đầu tiên (0) nằm trong đoạn từ giới hạn dưới (-10) đến giới hạn trên (10).',
    defaultParams: { val: 0, low: -10, high: 10 },
    pythonTemplate: (p) => `(${p.low} <= ${p.val} <= ${p.high})`
  },
  op_join: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.13',
    nameEn: 'join apple banana',
    nameVi: 'Nối hai chuỗi chữ (Join Strings)',
    description: 'Ghép nối chuỗi chữ thứ nhất ("apple") và chuỗi chữ thứ hai ("banana") thành một chuỗi liên tiếp.',
    defaultParams: { s1: 'apple', s2: 'banana' },
    pythonTemplate: (p) => `"${p.s1}" + "${p.s2}"`
  },
  op_letter_of: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.14',
    nameEn: 'letter 1 of apple',
    nameVi: 'Ký tự thứ N của chuỗi (Letter of String)',
    description: 'Trả về ký tự ở vị trí được chỉ định (ví dụ ký tự thứ 1 của "apple" là "a").',
    defaultParams: { index: 1, text: 'apple' },
    pythonTemplate: (p) => `"${p.text}"[${ (p.index || 1) - 1 }]`
  },
  op_length_of: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.15',
    nameEn: 'length of apple',
    nameVi: 'Độ dài của chuỗi chữ (Length of String)',
    description: 'Trả về số lượng ký tự có trong chuỗi chữ (ví dụ "apple" có độ dài là 5).',
    defaultParams: { text: 'apple' },
    pythonTemplate: (p) => `len("${p.text}")`
  },
  op_contains: {
    category: 'operators',
    shape: 'boolean',
    color: '#28A745',
    sectionCode: '8.16',
    nameEn: 'apple contains a ?',
    nameVi: 'Chuỗi có chứa ký tự không? (String Contains ?)',
    description: 'Khối Boolean lục giác: Kiểm tra xem chuỗi thứ nhất ("apple") có chứa chuỗi con thứ hai ("a") hay không.',
    defaultParams: { text: 'apple', sub: 'a' },
    pythonTemplate: (p) => `("${p.sub}" in "${p.text}")`
  },
  op_mod: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.17',
    nameEn: '( ) mod ( )',
    nameVi: 'Phép chia lấy phần dư (Modulo - mod)',
    description: 'Trả về số dư của phép chia số thứ nhất cho số thứ hai.',
    defaultParams: { a: '', b: '' },
    pythonTemplate: (p) => `(${p.a || 0} % ${p.b || 1})`
  },
  op_round: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    sectionCode: '8.18',
    nameEn: 'round ( )',
    nameVi: 'Làm tròn số (Round)',
    description: 'Làm tròn một số thập phân tới số nguyên gần nhất.',
    defaultParams: { a: '' },
    pythonTemplate: (p) => `round(${p.a || 0})`
  },
  op_math_func: {
    category: 'operators',
    shape: 'reporter',
    color: '#28A745',
    spacerTop: true,
    sectionCode: '8.19',
    nameEn: 'abs of ( )',
    nameVi: 'Hàm toán học nâng cao (abs, floor, ceiling, sqrt, sin, cos...)',
    description: 'Tính giá trị tuyệt đối (abs), làm tròn xuống (floor), làm tròn lên (ceiling), căn bậc hai (sqrt), lượng giác (sin, cos, tan)... của một số.',
    defaultParams: { func: 'abs', a: '' },
    pythonTemplate: (p) => `${p.func}(${p.a || 0})`
  },

  // ================= 9. VARIABLES & LISTS (MÀU CAM ĐẬM #FF8C1A & #FF661A - MỤC 9.1 -> 9.13) =================
  var_reporter: {
    category: 'variables',
    shape: 'reporter',
    color: '#FF8C1A',
    sectionCode: '9.1',
    nameEn: 'V',
    nameVi: 'Giá trị của Biến (Variable Reporter)',
    description: 'Khối báo giá trị hiện tại của biến V.',
    defaultParams: { varName: 'V' },
    pythonTemplate: (p) => `${p.varName}`
  },
  set_variable_to: {
    category: 'variables',
    shape: 'stack',
    color: '#FF8C1A',
    sectionCode: '9.2',
    nameEn: 'set V to 0',
    nameVi: 'Đặt biến thành (Set Variable To)',
    description: 'Gán giá trị số hoặc chuỗi chữ cho biến được chỉ định.',
    defaultParams: { varName: 'V', value: 0 },
    pythonTemplate: (p) => `${p.varName} = ${p.value}`
  },
  change_variable_by: {
    category: 'variables',
    shape: 'stack',
    color: '#FF8C1A',
    sectionCode: '9.3',
    nameEn: 'change V by 1',
    nameVi: 'Thay đổi biến một lượng (Change Variable By)',
    description: 'Cộng thêm một lượng đã cho vào giá trị hiện tại của biến.',
    defaultParams: { varName: 'V', delta: 1 },
    pythonTemplate: (p) => `${p.varName} += ${p.delta}`
  },
  list_reporter: {
    category: 'variables',
    shape: 'reporter',
    color: '#FF661A',
    spacerTop: true,
    sectionCode: '9.4',
    nameEn: 'L',
    nameVi: 'Danh sách (List Reporter)',
    description: 'Khối báo toàn bộ các phần tử trong danh sách L.',
    defaultParams: { listName: 'L' },
    pythonTemplate: (p) => `${p.listName}`
  },
  add_item_to_list: {
    category: 'variables',
    shape: 'stack',
    color: '#FF661A',
    sectionCode: '9.5',
    nameEn: 'add thing to L',
    nameVi: 'Thêm phần tử vào danh sách (Add Item to List)',
    description: 'Thêm phần tử được chỉ định vào cuối danh sách (List) L.',
    defaultParams: { item: 'thing', listName: 'L' },
    pythonTemplate: (p) => `${p.listName}.append("${p.item}")`
  },
  delete_of_list: {
    category: 'variables',
    shape: 'stack',
    color: '#FF661A',
    sectionCode: '9.6',
    nameEn: 'delete 1 of L',
    nameVi: 'Xóa phần tử thứ N của danh sách (Delete Item of List)',
    description: 'Xóa phần tử tại vị trí chỉ định khỏi danh sách L.',
    defaultParams: { index: 1, listName: 'L' },
    pythonTemplate: (p) => `del ${p.listName}[${(p.index || 1) - 1}]`
  },
  delete_all_of_list: {
    category: 'variables',
    shape: 'stack',
    color: '#FF661A',
    sectionCode: '9.7',
    nameEn: 'delete all of L',
    nameVi: 'Xóa tất cả phần tử của danh sách (Delete All of List)',
    description: 'Làm trống hoàn toàn danh sách L.',
    defaultParams: { listName: 'L' },
    pythonTemplate: (p) => `${p.listName}.clear()`
  },
  insert_at_list: {
    category: 'variables',
    shape: 'stack',
    color: '#FF661A',
    sectionCode: '9.8',
    nameEn: 'insert thing at 1 of L',
    nameVi: 'Chèn phần tử vào vị trí trong danh sách (Insert at List)',
    description: 'Chèn một phần tử mới vào vị trí thứ N trong danh sách L.',
    defaultParams: { item: 'thing', index: 1, listName: 'L' },
    pythonTemplate: (p) => `${p.listName}.insert(${(p.index || 1) - 1}, "${p.item}")`
  },
  replace_item_list: {
    category: 'variables',
    shape: 'stack',
    color: '#FF661A',
    sectionCode: '9.9',
    nameEn: 'replace item 1 of L with thing',
    nameVi: 'Thay thế phần tử trong danh sách (Replace Item of List)',
    description: 'Thay thế giá trị của phần tử thứ N trong danh sách L bằng giá trị mới.',
    defaultParams: { index: 1, listName: 'L', item: 'thing' },
    pythonTemplate: (p) => `${p.listName}[${(p.index || 1) - 1}] = "${p.item}"`
  },
  item_of_list: {
    category: 'variables',
    shape: 'reporter',
    color: '#FF661A',
    sectionCode: '9.10',
    nameEn: 'item 1 of L',
    nameVi: 'Lấy phần tử thứ N của danh sách (Item of List)',
    description: 'Trả về giá trị của phần tử nằm ở vị trí thứ N trong danh sách L.',
    defaultParams: { index: 1, listName: 'L' },
    pythonTemplate: (p) => `${p.listName}[${(p.index || 1) - 1}]`
  },
  item_num_of_list: {
    category: 'variables',
    shape: 'reporter',
    color: '#FF661A',
    sectionCode: '9.11',
    nameEn: 'item # of thing in L',
    nameVi: 'Vị trí của phần tử trong danh sách (Item # of in List)',
    description: 'Trả về số thứ tự xuất hiện đầu tiên của phần tử trong danh sách L.',
    defaultParams: { item: 'thing', listName: 'L' },
    pythonTemplate: (p) => `${p.listName}.index("${p.item}") + 1`
  },
  length_of_list: {
    category: 'variables',
    shape: 'reporter',
    color: '#FF661A',
    sectionCode: '9.12',
    nameEn: 'length of L',
    nameVi: 'Số lượng phần tử của danh sách (Length of List)',
    description: 'Trả về tổng số phần tử hiện có trong danh sách L.',
    defaultParams: { listName: 'L' },
    pythonTemplate: (p) => `len(${p.listName})`
  },
  list_contains: {
    category: 'variables',
    shape: 'boolean',
    color: '#FF661A',
    sectionCode: '9.13',
    nameEn: 'L contains thing ?',
    nameVi: 'Danh sách có chứa phần tử không? (List Contains ?)',
    description: 'Khối Boolean: Trả về True nếu phần tử có mặt trong danh sách L.',
    defaultParams: { listName: 'L', item: 'thing' },
    pythonTemplate: (p) => `("${p.item}" in ${p.listName})`
  },

  // ================= 10. MY BLOCKS (MÀU ĐỎ HỒNG #FF6680 - MỤC 9.14 -> 9.15) =================
  define_my_block: {
    category: 'my_blocks',
    shape: 'hat',
    color: '#FF6680',
    sectionCode: '9.14',
    nameEn: 'define GrabCargo',
    nameVi: 'Khối Định nghĩa (Define My Block)',
    description: 'Tạo khối lệnh con (hàm/thủ tục) của riêng em để tái sử dụng nhiều lần.',
    defaultParams: { blockName: 'GrabCargo' },
    pythonTemplate: (p) => `async def ${p.blockName}():`
  },
  call_my_block: {
    category: 'my_blocks',
    shape: 'stack',
    color: '#FF6680',
    sectionCode: '9.15',
    nameEn: 'GrabCargo',
    nameVi: 'Khối của tôi (Call My Block)',
    description: 'Gọi thực thi khối lệnh do em tự định nghĩa.',
    defaultParams: { blockName: 'GrabCargo' },
    pythonTemplate: (p) => `await ${p.blockName}()`
  },

  // ================= 11. MORE MOTORS EXTENSION =================
  more_motor_go_relative: {
    category: 'more_motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '11.1',
    nameEn: 'C go to relative position 90 at 80 % speed',
    nameVi: 'Đến vị trí tương đối của động cơ với tốc độ (More Motors)',
    description: 'Cho động cơ chạy đến vị trí tương đối với tốc độ % chỉ định (dùng điều khiển tay gắp 3D mở/đóng chính xác).',
    defaultParams: { port: 'C', position: 90, speed: 80 },
    pythonTemplate: (p) => `await motor.run_to_relative_position(port.${p.port}, ${p.position}, ${p.speed * 10})`
  },
  more_motor_reset_relative: {
    category: 'more_motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '11.2',
    nameEn: 'C set relative position to 0',
    nameVi: 'Đặt vị trí tương đối của động cơ về 0',
    description: 'Đặt lại bộ đếm góc tương đối của động cơ về 0.',
    defaultParams: { port: 'C', value: 0 },
    pythonTemplate: (p) => `motor.reset_relative_position(port.${p.port}, ${p.value})`
  },
  more_motor_relative_pos: {
    category: 'more_motors',
    shape: 'reporter',
    color: '#0090FF',
    sectionCode: '11.3',
    nameEn: 'A relative position',
    nameVi: 'Vị trí tương đối của động cơ (Relative Position)',
    description: 'Báo góc quay tương đối tích lũy của động cơ kể từ lần đặt lại gần nhất.',
    defaultParams: { port: 'A' },
    pythonTemplate: (p) => `motor.relative_position(port.${p.port})`
  },
  more_motor_start_power: {
    category: 'more_motors',
    shape: 'stack',
    color: '#0090FF',
    spacerTop: true,
    sectionCode: '11.4',
    nameEn: 'C start motor at 100 % power',
    nameVi: 'Khởi động động cơ với công suất (% Power)',
    description: 'Cho động cơ chạy liên tục với % công suất điện trực tiếp.',
    defaultParams: { port: 'C', power: 100 },
    pythonTemplate: (p) => `motor.set_duty_cycle(port.${p.port}, ${p.power * 100})`
  },
  more_motor_power: {
    category: 'more_motors',
    shape: 'reporter',
    color: '#0090FF',
    sectionCode: '11.5',
    nameEn: 'A power',
    nameVi: 'Công suất hiện tại của động cơ (% Power)',
    description: 'Báo mức % công suất mà động cơ đang sử dụng.',
    defaultParams: { port: 'A' },
    pythonTemplate: (p) => `motor.get_duty_cycle(port.${p.port})`
  },
  motor_set_stop_mode: {
    category: 'more_motors',
    shape: 'stack',
    color: '#0090FF',
    spacerTop: true,
    sectionCode: '11.6',
    nameEn: 'C set motors to hold position at stop',
    nameVi: 'Cách dừng động cơ: Brake / Hold position / Coast',
    description: 'Chọn cách động cơ dừng: Phanh (brake), Giữ chặt vị trí (hold position - rất cần cho tay nâng) hoặc Trôi tự do (coast).',
    defaultParams: { port: 'C', mode: 'hold position' },
    pythonTemplate: (p) => `# Set motor ${p.port} stop mode to ${p.mode}`
  },
  motor_set_acceleration: {
    category: 'more_motors',
    shape: 'stack',
    color: '#0090FF',
    sectionCode: '11.7',
    nameEn: 'C set acceleration to medium',
    nameVi: 'Đặt gia tốc động cơ (Fast / Medium / Slow)',
    description: 'Đặt độ mượt khi tăng tốc và giảm tốc cho động cơ.',
    defaultParams: { port: 'C', accel: 'medium' },
    pythonTemplate: (p) => `# Set motor ${p.port} acceleration to ${p.accel}`
  },

  // ================= 12. MORE MOVEMENT EXTENSION =================
  more_movement_tank: {
    category: 'more_movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '12.1',
    nameEn: 'start moving at 50 50 % speed',
    nameVi: 'Bắt đầu di chuyển với 2 tốc độ bánh trái/phải (Tank Move)',
    description: 'Điều khiển độc lập tốc độ động cơ bánh Trái và bánh Phải (Tank Drive).',
    defaultParams: { leftSpeed: 50, rightSpeed: 50 },
    pythonTemplate: (p) => `motor_pair.move_tank(motor_pair.PAIR_1, ${p.leftSpeed * 10}, ${p.rightSpeed * 10})`
  },
  more_movement_stop_mode: {
    category: 'more_movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '12.2',
    nameEn: 'set movement motors to brake at stop',
    nameVi: 'Đặt cách dừng của động cơ di chuyển (Brake / Hold / Coast)',
    description: 'Quy định cách 2 bánh xe dừng lại khi hết quãng đường.',
    defaultParams: { mode: 'brake' },
    pythonTemplate: (p) => `# Set movement stop mode to ${p.mode}`
  },
  more_movement_accel: {
    category: 'more_movement',
    shape: 'stack',
    color: '#EA3396',
    sectionCode: '12.3',
    nameEn: 'set movement acceleration to medium',
    nameVi: 'Đặt gia tốc di chuyển của Xe robot',
    description: 'Giúp xe robot khởi hành và phanh mượt mà, tránh trượt bánh trên sa bàn thi đấu.',
    defaultParams: { accel: 'medium' },
    pythonTemplate: (p) => `# Set movement acceleration to ${p.accel}`
  },

  // ================= 13. MORE SENSORS EXTENSION =================
  more_sensor_raw_color: {
    category: 'more_sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '13.1',
    nameEn: 'D raw red',
    nameVi: 'Giá trị màu thô RGB (Raw Color Red / Green / Blue)',
    description: 'Trả về cường độ màu Đỏ, Xanh lá hoặc Xanh dương thô (0 - 255) từ Cảm biến màu.',
    defaultParams: { port: 'D', channel: 'red' },
    pythonTemplate: (p) => `color_sensor.rgbi(port.${p.port})`
  },
  more_sensor_accel: {
    category: 'more_sensors',
    shape: 'reporter',
    color: '#0EB8D6',
    sectionCode: '13.2',
    nameEn: 'acceleration x',
    nameVi: 'Gia tốc của Hub theo trục X / Y / Z',
    description: 'Đo gia tốc chuyển động của Hub trên 3 trục không gian.',
    defaultParams: { axis: 'x' },
    pythonTemplate: (p) => `motion_sensor.acceleration()`
  },
  more_sensor_set_orientation: {
    category: 'more_sensors',
    shape: 'stack',
    color: '#0EB8D6',
    sectionCode: '13.6',
    nameEn: 'set sensor orientation to front',
    nameVi: 'Đặt hướng cảm biến con quay 6 trục của Hub',
    description: 'Cấu hình lại trục tọa độ của cảm biến Gyro khi lắp Hub đứng hoặc nghiêng trên Robot.',
    defaultParams: { side: 'front' },
    pythonTemplate: (p) => `# Set gyro sensor orientation to ${p.side}`
  },

  // ================= 14. MUSIC, 15. LINE GRAPH, 16. BAR GRAPH, 17. DISPLAY, 10. WEATHER =================
  music_play_drum: {
    category: 'music',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '14.1',
    nameEn: 'play drum (1) Snare Drum for 0.25 beats',
    nameVi: 'Đánh trống (Play Drum)',
    description: 'Đánh nhịp trống trong số phách (beats) chỉ định.',
    defaultParams: { drum: '(1) Snare Drum', beats: 0.25 },
    pythonTemplate: (p) => `# Play drum ${p.drum} for ${p.beats} beats`
  },
  music_play_note: {
    category: 'music',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '14.3',
    nameEn: 'play note 60 for 0.25 beats',
    nameVi: 'Chơi nốt nhạc (Play Note)',
    description: 'Chơi nốt nhạc MIDI trong khoảng thời gian tính bằng phách (beats).',
    defaultParams: { note: 60, beats: 0.25 },
    pythonTemplate: (p) => `await sound.beep(${p.note * 7}, ${Math.round(p.beats * 1000)}, 100)`
  },
  line_graph_plot: {
    category: 'line_graph',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '15.1',
    nameEn: 'plot 50 to blue line',
    nameVi: 'Vẽ giá trị lên Biểu đồ đường (Plot Value on Line)',
    description: 'Ghi và vẽ giá trị cảm biến theo thời gian thực lên biểu đồ đường.',
    defaultParams: { value: 50, color: 'blue' },
    pythonTemplate: (p) => `# Plot ${p.value} to ${p.color} line graph`
  },
  bar_graph_set: {
    category: 'bar_graph',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '16.2',
    nameEn: 'set blue bar value to 10',
    nameVi: 'Đặt giá trị cột trên Biểu đồ cột (Set Bar Value)',
    description: 'Hiển thị độ cao của cột dữ liệu trên Biểu đồ cột.',
    defaultParams: { color: 'blue', value: 10 },
    pythonTemplate: (p) => `# Set ${p.color} bar graph to ${p.value}`
  },
  display_write: {
    category: 'display',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '17.1',
    nameEn: 'write Hello for 2 seconds',
    nameVi: 'Viết lên Màn hình trong số giây (Write on Display)',
    description: 'Hiển thị chuỗi chữ trong cửa sổ Màn hình (Display) trên màn hình máy tính.',
    defaultParams: { text: 'Hello', seconds: 2 },
    pythonTemplate: (p) => `print("${p.text}")`
  },
  weather_set_location: {
    category: 'weather',
    shape: 'stack',
    color: '#0F9D8A',
    sectionCode: '10.1',
    nameEn: 'set location to Billund',
    nameVi: 'Đặt địa điểm dự báo thời tiết (Set Forecast Location)',
    description: 'Chọn thành phố cần lấy dữ liệu dự báo thời tiết thời gian thực.',
    defaultParams: { city: 'Billund' },
    pythonTemplate: (p) => `# Weather forecast location: ${p.city}`
  },
  weather_temperature: {
    category: 'weather',
    shape: 'reporter',
    color: '#0F9D8A',
    sectionCode: '10.3',
    nameEn: 'temperature in °C',
    nameVi: 'Nhiệt độ dự báo tại địa điểm đã chọn',
    description: 'Trả về nhiệt độ hiện tại (°C hoặc °F) ở địa điểm thời tiết đã chọn.',
    defaultParams: { unit: '°C' },
    pythonTemplate: () => `# weather temperature`
  }
};

// Giữ mảng trống để tương thích ngược vì mọi khối Reporter & Boolean nay đều được vẽ trực tiếp bằng SpikeBlockItem
export const REPORTER_AND_BOOLEAN_BLOCKS = [];

export const CURRICULUM_LESSONS = [
  {
    id: 'lesson_1',
    level: 'Unit 1: Invention Squad & Hub Basics',
    title: 'Bài 1: Làm quen Hub, Khối Mũ (Hat Block) & 5x5 Light Matrix',
    mode: '2D',
    mapType: 'sensor_lab',
    objective: 'Kéo thả khối "when program starts", "turn on 5x5 matrix", "write" và "play beep" đúng chuẩn LEGO Education SPIKE.',
    steps: [
      'Quan sát khối mũ màu vàng "when program starts" (Mục 5.1) ở đầu chồng lệnh.',
      'Kéo thêm các khối màu tím Light (3.1 - 3.8) hoặc Sound (4.1 - 4.11) từ cột trái ghép vào chồng lệnh.',
      'Nhấn nút ▶ (Góc dưới phải) và quan sát màn hình 5x5 Light Matrix sáng lên!'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'light_matrix_turn_on_for_seconds', params: { pattern: 'SMILE', seconds: 1.2 } },
      { id: 'b2', type: 'set_center_button_light', params: { color: 'GREEN' } },
      { id: 'b3', type: 'play_beep_for_seconds', params: { note: 60, seconds: 0.3 } },
      { id: 'b4', type: 'light_matrix_write', params: { text: 'LEGO' } },
      { id: 'b5', type: 'light_matrix_turn_on', params: { pattern: 'HEART' } }
    ]
  },
  {
    id: 'lesson_2',
    level: 'Unit 2: Kickstart a Business (Motors & Sensors)',
    title: 'Bài 2: Khối Động Cơ Đơn (Motor Blocks) & Đèn Cảm Biến',
    mode: '2D',
    mapType: 'sensor_lab',
    objective: 'Thực hành khối "A set speed to (75) %", "C run ↻ for (1) rotations" và "C go [shortest path] to position (45)".',
    steps: [
      'Kiểm tra Cổng C đang gắn Large Motor và Cổng E gắn Distance Sensor.',
      'Kéo các khối màu xanh dương Motors (Mục 1.1 - 1.7) để điều khiển từng động cơ độc lập.',
      'Nhấn ▶ để xem góc quay trên cổng C thay đổi theo thời gian thực.'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'motor_set_speed', params: { port: 'C', speed: 75 } },
      { id: 'b2', type: 'motor_run_for_duration', params: { port: 'C', direction: 'clockwise', value: 1, unit: 'rotations' } },
      { id: 'b3', type: 'wait_seconds', params: { seconds: 0.5 } },
      { id: 'b4', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 45 } },
      { id: 'b5', type: 'light_up_distance_sensor', params: { port: 'E', mode: 'all 4 lights' } }
    ]
  },
  {
    id: 'lesson_3',
    level: 'Unit 3: Competition Ready - Driving Base 1',
    title: 'Bài 3: Điều khiển Xe Robot (Driving Base 1) Vượt Mê Cung',
    mode: '2D',
    mapType: 'maze',
    objective: 'Dùng nhóm khối hồng Movement: "set movement motors to [A+B]", "move [↑] for (140) [cm]" và "move [right: 90] for (1) [rotations]".',
    steps: [
      'Luôn khai báo cặp động cơ bánh xe bằng khối "set movement motors to [A+B]" (Mục 2.7) và "set yaw angle to 0" (7.13).',
      'Cho xe đi thẳng 140 cm, rẽ phải góc vuông, rồi đi tiếp 110 cm tới ô GOAL.',
      'Quan sát đường đi của Robot trên Sa bàn 2D trong khung màu đỏ bên phải.'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'set_movement_speed', params: { speed: 60 } },
      { id: 'b3', type: 'set_yaw_angle_to_0', params: {} },
      { id: 'b4', type: 'move_for_duration', params: { direction: 'forward', value: 140, unit: 'cm' } },
      { id: 'b5', type: 'move_with_steering', params: { steeringText: 'right: 90', steering: 90, value: 1, unit: 'rotations' } },
      { id: 'b6', type: 'move_for_duration', params: { direction: 'forward', value: 110, unit: 'cm' } },
      { id: 'b7', type: 'light_matrix_turn_on', params: { pattern: 'YES' } }
    ]
  },
  {
    id: 'lesson_4',
    level: 'Unit 4: Competition Ready - Driving Base 2 (Sensors)',
    title: 'Bài 4: Vòng lặp Chữ C (Repeat) Dò Line & Chờ Cảm Biến (Wait Until)',
    mode: '2D',
    mapType: 'line_track',
    objective: 'Phối hợp khối chữ C "repeat (90)" để dò line đen (Cổng D) và khối "wait until <E is closer than 25 cm?>" để dừng trước vật cản.',
    steps: [
      'Quan sát khối chữ C "repeat" (Mục 6.2) và khối "wait until <boolean>" có ô lục giác (Mục 6.6 & 7.7).',
      'Robot sẽ bám theo đường cong màu đen, sau đó tiến tới và tự động phanh bằng khối "stop moving" (2.5) khi gặp vật cản đỏ.',
      'Kết thúc chồng lệnh bằng khối đáy phẳng "stop [all]" (Cap Block - Mục 6.9).'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      {
        id: 'b2',
        type: 'repeat_loop_line_follow',
        params: { times: 90, action: 'line_follow_port_D' },
        children: [
          {
            id: 'b2_ifelse',
            type: 'if_else_block',
            params: {},
            conditionBlock: {
              id: 'b2_cond',
              type: 'sensor_is_reflection',
              params: { port: 'D', comp: '<', value: 50 }
            },
            children: [
              { id: 'b2_then', type: 'start_moving_steering', params: { steering: 30 } }
            ],
            elseChildren: [
              { id: 'b2_else', type: 'start_moving_steering', params: { steering: -30 } }
            ]
          }
        ]
      },
      { id: 'b3', type: 'start_moving', params: { direction: 'forward' } },
      {
        id: 'b4',
        type: 'wait_until_sensor',
        params: { port: 'E', condition: 'closer than', value: 25, unit: 'cm' },
        conditionBlock: {
          id: 'b4_cond',
          type: 'sensor_is_closer_than',
          params: { port: 'E', comp: 'closer than', value: 25, unit: 'cm' }
        }
      },
      { id: 'b5', type: 'stop_moving', params: {} },
      { id: 'b6', type: 'play_beep_for_seconds', params: { note: 72, seconds: 0.4 } },
      { id: 'b7', type: 'stop_all_cap', params: { target: 'all' } }
    ]
  },
  {
    id: 'lesson_5',
    level: 'Unit 5: Driving Base 3 + Super Cleanup Grabber (3D)',
    title: 'Bài 5: Cơ Cấu Tay Nâng Hạ & Gắp Kiện Hàng Lên Bệ Cao (3D)',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_grab_lift',
    objective: 'Sử dụng khối "C go [shortest path] to position" (1.2) và Extension "More Motors: go to relative position" (11.1) để gắp kiện hàng 3D đặt lên bệ cao.',
    steps: [
      'Sa bàn trong khung màu đỏ đã chuyển sang Không gian 3D (có thể chọn 6 sa bàn 3D khác nhau hoặc kéo thả trực tiếp kiện hàng 3D bằng chuột).',
      'Khối "C go to position (10)" hạ cần cẩu -> "move ↑ for (95) cm" tiến tới khối hàng -> "C go to relative position (90)" đóng tay kẹp -> "C go to position (75)" nâng bổng kiện hàng lên!',
      'Bấm vào tab "Cơ Cấu & Lắp Ráp" trong khung màu đỏ để tìm hiểu nguyên lý truyền động bánh răng của tay gắp.'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 10 } },
      { id: 'b3', type: 'more_motor_go_relative', params: { port: 'C', position: -90, speed: 80 } },
      { id: 'b4', type: 'move_for_duration', params: { direction: 'forward', value: 95, unit: 'cm' } },
      { id: 'b5', type: 'more_motor_go_relative', params: { port: 'C', position: 90, speed: 80 } },
      { id: 'b6', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 75 } },
      { id: 'b7', type: 'move_for_duration', params: { direction: 'forward', value: 55, unit: 'cm' } },
      { id: 'b8', type: 'more_motor_go_relative', params: { port: 'C', position: -90, speed: 80 } },
      { id: 'b9', type: 'display_write', params: { text: '3D Cargo Lifted!', seconds: 2 } }
    ]
  },
  {
    id: 'lesson_6',
    level: 'Unit 6: Advanced Navigation - Slalom',
    title: 'Bài 6: Luồn Lách Zíc-Zắc Qua 3 Trụ Cản (Slalom Obstacles)',
    mode: '2D',
    mapType: 'slalom_obstacles',
    winCondition: 'reach_goal',
    objective: 'Lập trình xe Robot đánh lái luồn qua 3 trụ vật cản P1, P2, P3 để về đích SLALOM GOAL.',
    steps: [
      'Quan sát vị trí 3 trụ cản P1, P2, P3 trên sa bàn Zíc-zắc.',
      'Phối hợp khối "move [↑] for (cm)" và "move [right/left] for (rotations)" để chuyển làn không chạm trụ.',
      'Bạn có thể bấm nút "🛠 Thiết Kế Sa Bàn" để thêm/xóa trụ cản tùy ý!'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'set_movement_speed', params: { speed: 60 } },
      { id: 'b3', type: 'move_with_steering', params: { steeringText: 'left: -45', steering: -45, value: 1, unit: 'rotations' } },
      { id: 'b4', type: 'move_for_duration', params: { direction: 'forward', value: 90, unit: 'cm' } },
      { id: 'b5', type: 'move_with_steering', params: { steeringText: 'right: 90', steering: 90, value: 1, unit: 'rotations' } },
      { id: 'b6', type: 'move_for_duration', params: { direction: 'forward', value: 130, unit: 'cm' } },
      { id: 'b7', type: 'move_with_steering', params: { steeringText: 'left: -90', steering: -90, value: 1, unit: 'rotations' } },
      { id: 'b8', type: 'move_for_duration', params: { direction: 'forward', value: 130, unit: 'cm' } },
      { id: 'b9', type: 'move_with_steering', params: { steeringText: 'right: 45', steering: 45, value: 1, unit: 'rotations' } },
      { id: 'b10', type: 'move_for_duration', params: { direction: 'forward', value: 120, unit: 'cm' } }
    ]
  },
  {
    id: 'lesson_7',
    level: 'Unit 7: FIRST® LEGO® League (FLL) Challenge',
    title: 'Bài 7: Thảm Thi Đấu FLL (Giải Quyết 3 Trạm M01, M02, M03)',
    mode: '2D',
    mapType: 'fll_challenge',
    winCondition: 'reach_goal',
    objective: 'Xuất phát từ BASE (góc dưới trái), di chuyển qua các trạm M01, M02 và tiến vào trạm M03 (Drop Zone).',
    steps: [
      'Sa bàn mô phỏng thảm thi đấu FIRST® LEGO® League với vùng BASE và 3 trạm nhiệm vụ M01, M02, M03.',
      'Điều khiển Robot rời khỏi BASE, đi qua hành lang trung tâm để tiếp cận M03.',
      'Có thể tải ảnh thảm thi đấu FLL thực tế của trường bạn bằng nút "Tải ảnh Thảm FLL" trong công cụ Thiết Kế Sa Bàn!'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'move_for_duration', params: { direction: 'forward', value: 160, unit: 'cm' } },
      { id: 'b3', type: 'move_with_steering', params: { steeringText: 'left: -45', steering: -45, value: 1, unit: 'rotations' } },
      { id: 'b4', type: 'move_for_duration', params: { direction: 'forward', value: 140, unit: 'cm' } },
      { id: 'b5', type: 'move_with_steering', params: { steeringText: 'right: 45', steering: 45, value: 1, unit: 'rotations' } },
      { id: 'b6', type: 'move_for_duration', params: { direction: 'forward', value: 100, unit: 'cm' } },
      { id: 'b7', type: 'light_matrix_turn_on', params: { pattern: 'HEART' } }
    ]
  },
  {
    id: 'lesson_8',
    level: 'Unit 8: Creative Sandbox (Tự Thiết Kế Sa Bàn & Đề Bài)',
    title: 'Bài 8: Sa Bàn Tự Do - Tự Vẽ Đường Line, Đặt Đích & Vật Cản',
    mode: '2D',
    mapType: 'custom_blank',
    winCondition: 'reach_goal',
    objective: 'Bấm nút "🛠 Thiết Kế Sa Bàn" trên sa bàn để tự vẽ đường line đen, đặt Đích GOAL, Tường chắn, Vật cản, Dải màu hoặc tải ảnh thảm thi đấu.',
    steps: [
      'Nhấn nút "🛠 Thiết Kế Sa Bàn" ở góc trên phải của Sa bàn 2D.',
      'Chọn công cụ: "Vẽ Line Đen", "Đặt Đích GOAL", "Vật Cản (Ultrasonic)", "Tường Ngang/Dọc", hoặc "Dải Màu Cảm Biến" rồi click/kéo trực tiếp trên sa bàn.',
      'Nhấn nút "🎯 Quản Lý Nhiệm Vụ" trên thanh tiêu đề để Lưu sa bàn và tạo thêm không giới hạn nhiệm vụ mới cho học sinh!'
    ],
    arenaConfig: {
      startPose: { x: 65, y: 132, angle: 0 },
      lines: [
        [
          { x: 65, y: 132 },
          { x: 150, y: 132 },
          { x: 220, y: 85 },
          { x: 310, y: 85 },
          { x: 375, y: 155 },
          { x: 440, y: 155 }
        ]
      ],
      goals: [{ id: 'g_default', x: 415, y: 130, w: 62, h: 50, label: 'CUSTOM GOAL' }],
      obstacles: [{ id: 'obs_default', x: 265, y: 175, r: 16, label: 'OBS 1' }],
      walls: [{ id: 'w_default', x: 175, y: 130, w: 14, h: 80 }],
      colorPatches: [{ id: 'cp_default', x: 140, y: 118, w: 24, h: 28, color: 'GREEN', hex: '#16a34a' }],
      backgroundImage: ''
    },
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'repeat_loop_line_follow', params: { times: 85, action: 'line_follow_port_D' } },
      { id: 'b3', type: 'play_beep_for_seconds', params: { note: 72, seconds: 0.3 } }
    ]
  },
  {
    id: 'lesson_9',
    level: 'Unit 9: 3D Warehouse Forklift & Rack Stacking',
    title: 'Bài 9: Xe Nâng Forklift 3D — Xếp Pallet Lên Kệ Kho Tầng 2',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_forklift_pallet',
    objective: 'Điều khiển Càng nâng Forklift (Port C) hạ thấp luồn dưới kiện hàng Pallet, nâng cao lên 75° và tiến vào đặt lên Giá Kệ Kho Tầng 2.',
    steps: [
      'Hạ càng nâng Forklift xuống góc 10° bằng khối "C go [shortest path] to position (10)".',
      'Cho xe tiến tới kiện hàng Pallet màu cam, sau đó nâng càng lên góc 75° để nhấc bổng kiện hàng.',
      'Tiến thêm tới sát kệ kho 2 tầng rồi hạ càng để đặt kiện hàng lên tầng trên!'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 10 } },
      { id: 'b3', type: 'move_for_duration', params: { direction: 'forward', value: 85, unit: 'cm' } },
      { id: 'b4', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 78 } },
      { id: 'b5', type: 'move_for_duration', params: { direction: 'forward', value: 65, unit: 'cm' } },
      { id: 'b6', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 42 } },
      { id: 'b7', type: 'display_write', params: { text: 'Pallet Stacked!', seconds: 2 } }
    ]
  },
  {
    id: 'lesson_10',
    level: 'Unit 10: 3D Drag & Drop Color Cargo Sorting',
    title: 'Bài 10: Kéo - Thả & Phân Loại 3 Kiện Hàng Màu Trong Không Gian 3D',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_drag_drop_sorting',
    objective: 'Gắp, nâng và thả các kiện hàng 3D (Đỏ, Xanh lá, Xanh dương) vào đúng ô đích tương ứng (hoặc dùng chuột kéo thả trực tiếp kiện hàng 3D).',
    steps: [
      'Trong chế độ 3D, bạn có thể nhấn nút "✋ Kéo Thả Kiện Hàng 3D" để dùng chuột kéo các khối hàng đặt vào bất kỳ vị trí nào trên sàn.',
      'Lập trình Robot tiến tới kiện hàng ở giữa, đóng tay gắp (+90°), nâng lên và chở thẳng vào ô đích Xanh lá.',
      'Thử đổi sang các sa bàn 3D khác như Cần Cẩu Tháp, Xe Ủi Bulldozer hoặc Cầu Rút FLL ở menu chọn sa bàn 3D!'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 12 } },
      { id: 'b3', type: 'move_for_duration', params: { direction: 'forward', value: 90, unit: 'cm' } },
      { id: 'b4', type: 'more_motor_go_relative', params: { port: 'C', position: 90, speed: 80 } },
      { id: 'b5', type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: 50 } },
      { id: 'b6', type: 'move_for_duration', params: { direction: 'forward', value: 70, unit: 'cm' } },
      { id: 'b7', type: 'more_motor_go_relative', params: { port: 'C', position: -90, speed: 80 } }
    ]
  },
  {
    id: 'lesson_11',
    level: 'Unit 11: WRO Smart City & Rescue Line',
    title: 'Bài 11: Sa Bàn WRO Đô Thị Thông Minh — Giao Lộ Ngã Tư & 4 Trạm Màu',
    mode: '2D',
    mapType: 'wro_smart_city',
    winCondition: 'reach_goal',
    objective: 'Khám phá các sa bàn 2D mới: WRO Smart City, Kho Hàng Amazon, RoboCup Rescue Line, Võ Đài Sumo và Bãi Đỗ Xe Tự Động.',
    steps: [
      'Sử dụng menu chọn Sa bàn 2D (có 12 sa bàn mẫu đa dạng) để chuyển đổi giữa WRO Smart City, Kho Hàng, Rescue Line, Sumo Ring, Parking Garage.',
      'Bấm "🛠 Thiết Kế Sa Bàn" để vẽ thêm đường Line chính xác ngay tại đầu con trỏ chuột hoặc chèn Mẫu Đường Line Nhanh (Hình số 8, S-Curve, Zíc-zắc).'
    ],
    defaultBlocks: [
      { id: 'b0', type: 'when_program_starts', params: {} },
      { id: 'b1', type: 'set_movement_motors', params: { ports: 'A+B' } },
      { id: 'b2', type: 'move_for_duration', params: { direction: 'forward', value: 115, unit: 'cm' } },
      { id: 'b3', type: 'move_with_steering', params: { steeringText: 'left: -90', steering: -90, value: 1, unit: 'rotations' } },
      { id: 'b4', type: 'move_for_duration', params: { direction: 'forward', value: 85, unit: 'cm' } },
      { id: 'b5', type: 'play_beep_for_seconds', params: { note: 72, seconds: 0.3 } }
    ]
  }
];

function formatConditionPython(condBlock, fallbackParams = {}) {
  if (!condBlock) {
    if (fallbackParams.port && fallbackParams.condition) {
      return `distance_sensor.distance(port.${fallbackParams.port}) < ${(fallbackParams.value || 25) * 10}`;
    }
    return 'True';
  }
  const cDef = BLOCK_DEFINITIONS[condBlock.type];
  if (cDef && cDef.pythonTemplate) {
    return cDef.pythonTemplate(condBlock.params || {});
  }
  return 'True';
}

function generateBlockLinesRecursive(blockList, indentLevel = 1) {
  const pad = '    '.repeat(indentLevel);
  const out = [];
  if (!blockList || blockList.length === 0) {
    out.push(`${pad}pass`);
    return out;
  }

  for (const b of blockList) {
    const def = BLOCK_DEFINITIONS[b.type];
    if (!def) continue;
    const p = b.params || {};

    if (b.type === 'repeat_loop_line_follow') {
      out.push(`${pad}for _ in range(${p.times ?? 10}):`);
      if (b.children && b.children.length > 0) {
        out.push(...generateBlockLinesRecursive(b.children, indentLevel + 1));
      } else {
        out.push(`${pad}    err = color_sensor.reflection(port.D) - 50`);
        out.push(`${pad}    motor_pair.move(motor_pair.PAIR_1, int(err * 1.2), velocity=450)`);
        out.push(`${pad}    await runloop.sleep_ms(30)`);
      }
    } else if (b.type === 'forever_loop') {
      out.push(`${pad}while True:`);
      if (b.children && b.children.length > 0) {
        out.push(...generateBlockLinesRecursive(b.children, indentLevel + 1));
      } else {
        out.push(`${pad}    await runloop.sleep_ms(50)`);
      }
    } else if (b.type === 'if_then_block') {
      const condPy = formatConditionPython(b.conditionBlock, p);
      out.push(`${pad}if ${condPy}:`);
      out.push(...generateBlockLinesRecursive(b.children, indentLevel + 1));
    } else if (b.type === 'if_else_block') {
      const condPy = formatConditionPython(b.conditionBlock, p);
      out.push(`${pad}if ${condPy}:`);
      out.push(...generateBlockLinesRecursive(b.children, indentLevel + 1));
      out.push(`${pad}else:`);
      out.push(...generateBlockLinesRecursive(b.elseChildren, indentLevel + 1));
    } else if (b.type === 'repeat_until_block') {
      const condPy = formatConditionPython(b.conditionBlock, p);
      out.push(`${pad}while not (${condPy}):`);
      out.push(...generateBlockLinesRecursive(b.children, indentLevel + 1));
    } else if (b.type === 'wait_until_sensor') {
      const condPy = formatConditionPython(b.conditionBlock, p);
      out.push(`${pad}while not (${condPy}):`);
      out.push(`${pad}    await runloop.sleep_ms(20)`);
    } else {
      out.push(`${pad}${def.pythonTemplate(p)}`);
    }
  }
  return out;
}

export function generateSpikePythonCode(blocks) {
  const lines = [
    '# LEGO® Education SPIKE™ Prime - Python 3 API (Auto-generated from Word Blocks)',
    'from hub import light_matrix, sound, motion_sensor, port',
    'import runloop, motor, motor_pair, color_sensor, distance_sensor, force_sensor, random, math',
    '',
    'async def main():',
    '    motor_pair.pair(motor_pair.PAIR_1, port.A, port.B)',
    ''
  ];

  if (!blocks || blocks.length === 0) {
    lines.push('    pass');
  } else {
    lines.push(...generateBlockLinesRecursive(blocks, 1));
  }

  lines.push('');
  lines.push('runloop.run(main())');
  return lines.join('\n');
}
