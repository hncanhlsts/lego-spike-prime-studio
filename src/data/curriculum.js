// =====================================================================================
// curriculum.js — Lộ trình học LEGO® SPIKE™ Prime: Nền tảng → Nhiệm vụ → Luyện thi FLL/WRO
// Mỗi bài tách riêng: Đề bài (yêu cầu + tiêu chí đạt) · Lý thuyết · Gợi ý · Code khởi đầu · Lời giải
// Thiết kế bởi thầy Hoàng Ngọc Cảnh — Giáo viên trường THCS & THPT Đinh Thiện Lý
// =====================================================================================

export const LEARNING_TRACKS = [
  {
    id: 'foundation',
    icon: '🧱',
    name: 'Nền tảng — Kỹ thuật lập trình',
    description: 'Các kỹ thuật cốt lõi mọi đội FLL/WRO phải nắm: tuần tự, vòng lặp, chờ cảm biến, rẽ nhánh, dò line, điều khiển cơ cấu.'
  },
  {
    id: 'mission',
    icon: '🎯',
    name: 'Nhiệm vụ ứng dụng',
    description: 'Vận dụng kỹ thuật để giải bài toán thực tế: mê cung, né vật cản, đỗ xe, xe nâng, phân loại hàng.'
  },
  {
    id: 'competition',
    icon: '🏆',
    name: 'Luyện thi FLL / WRO',
    description: 'Mô phỏng nhiệm vụ thi đấu. Lời giải mặc định bị khóa — chỉ có gợi ý.'
  },
  {
    id: 'sandbox',
    icon: '🛠',
    name: 'Sa bàn tự do & Bài của giáo viên',
    description: 'Tự thiết kế sa bàn, tự đặt đề bài.'
  }
];

export const WIN_CONDITIONS = [
  { value: 'run_complete', label: 'Chạy hết chương trình (không kiểm tra vị trí)' },
  { value: 'reach_goal', label: 'Robot đi vào một ô Đích (GOAL)' },
  { value: 'visit_in_order', label: 'Đi qua các trạm theo đúng thứ tự' },
  { value: 'return_to_start', label: 'Quay về lại vị trí xuất phát' },
  { value: 'stop_before_obstacle', label: 'Dừng trước vật cản trong khoảng cho phép' },
  { value: 'stop_on_color', label: 'Dừng trên vạch màu chỉ định' },
  { value: 'cargo_in_zone', label: '3D: Đặt kiện hàng vào vùng đích' }
];

const HAT = (p) => ({ id: `${p}_hat`, type: 'when_program_starts', params: {} });
const MOTORS = (p) => ({ id: `${p}_mm`, type: 'set_movement_motors', params: { ports: 'A+B' } });
const FWD = (id, cm) => ({ id, type: 'move_for_duration', params: { direction: 'forward', value: cm, unit: 'cm' } });
const TURN = (id, deg) => ({
  id,
  type: 'move_with_steering',
  params: { steeringText: `${deg < 0 ? 'left' : 'right'}: ${deg}`, steering: deg, value: 1, unit: 'rotations' }
});
const CPOS = (id, pos) => ({ id, type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: pos } });
const GRIP = (id, pos) => ({ id, type: 'more_motor_go_relative', params: { port: 'C', position: pos, speed: 80 } });

export const CURRICULUM = [
  // ============================== 🧱 NỀN TẢNG ==============================
  {
    id: 'F1',
    track: 'foundation',
    level: 'Nền tảng 1 · Khối mũ, Đèn & Âm thanh',
    title: 'F1. Làm quen Hub: Khối mũ, Màn hình 5x5 & Âm thanh',
    mode: '2D',
    mapType: 'sensor_lab',
    objective: 'Viết chương trình chào hỏi: hiện mặt cười, phát tiếng bíp và chạy chữ "LEGO" trên Hub.',
    requirements: [
      'Chương trình bắt đầu bằng khối mũ "when program starts".',
      'Bật hình mặt cười (SMILE) trên màn hình 5x5 trong 1 giây.',
      'Phát 1 tiếng bíp.',
      'Viết chữ "LEGO" lên màn hình.'
    ],
    successCriteria: ['Chương trình chạy hết không lỗi', 'Có dùng khối "write" và khối "play beep"'],
    theory: [
      'Khối MŨ (Hat, màu vàng, đỉnh cong) luôn đứng đầu chồng lệnh — nó quyết định KHI NÀO chương trình chạy.',
      'Các khối XẾP CHỒNG (Stack) chạy lần lượt từ trên xuống dưới: đây là cấu trúc TUẦN TỰ.',
      'Nhóm Light (tím) điều khiển màn hình 5x5; nhóm Sound (hồng) phát âm thanh.'
    ],
    hints: [
      'Mở nhóm Light (chấm tím) ở thanh bên trái — tìm khối "turn on ... for 2 seconds".',
      'Khối "play beep" nằm trong nhóm Sound. Khối "write" nằm trong nhóm Light.',
      'Thứ tự: when program starts → turn on SMILE → play beep → write LEGO.'
    ],
    starterBlocks: [HAT('f1')],
    solutionBlocks: [
      HAT('f1s'),
      { id: 'f1s1', type: 'light_matrix_turn_on_for_seconds', params: { pattern: 'SMILE', seconds: 1 } },
      { id: 'f1s2', type: 'play_beep_for_seconds', params: { note: 60, seconds: 0.3 } },
      { id: 'f1s3', type: 'light_matrix_write', params: { text: 'LEGO' } }
    ],
    winCondition: 'run_complete',
    requiredBlocks: ['light_matrix_write', 'play_beep_for_seconds']
  },
  {
    id: 'F2',
    track: 'foundation',
    level: 'Nền tảng 2 · Lập trình tuần tự',
    title: 'F2. Tuần tự: Đi thẳng & Rẽ góc vuông tới ô GOAL',
    mode: '2D',
    mapType: 'custom_blank',
    objective: 'Điều khiển robot đi thẳng rồi rẽ trái 90° để vào ô GOAL màu xanh.',
    requirements: [
      'Khai báo cặp động cơ di chuyển A+B.',
      'Đi thẳng đến ngang ô GOAL, rẽ trái 90°, đi tiếp vào ô GOAL.'
    ],
    successCriteria: ['Robot dừng lại bên trong ô GOAL', 'Không chạm vật cản'],
    theory: [
      'Khối "move ↑ for (x) cm" cho xe đi một quãng đường chính xác.',
      'Khối "move [left/right: góc] ..." xoay robot tại chỗ: góc âm = rẽ trái, góc dương = rẽ phải.',
      'Đo bằng ô lưới: mỗi ô lưới trên sa bàn ≈ 23 cm (25 px).'
    ],
    hints: [
      'Rê chuột lên sa bàn khi bật thiết kế sẽ thấy tọa độ; robot xuất phát ở X = 75.',
      'Ô GOAL nằm ở X ≈ 240 → cần đi khoảng (240 − 75) / 1.1 ≈ 150 cm.',
      'Sau khi rẽ trái −90°, đi thêm khoảng 70 cm.'
    ],
    arenaConfig: {
      startPose: { x: 75, y: 132, angle: 0 },
      lines: [],
      goals: [{ id: 'f2_goal', x: 210, y: 25, w: 60, h: 55, label: 'GOAL' }],
      obstacles: [],
      walls: [],
      colorPatches: [],
      cargos: []
    },
    starterBlocks: [HAT('f2'), MOTORS('f2')],
    solutionBlocks: [HAT('f2s'), MOTORS('f2s'), FWD('f2s1', 150), TURN('f2s2', -90), FWD('f2s3', 70)],
    winCondition: 'reach_goal',
    requiredBlocks: ['move_for_duration', 'move_with_steering']
  },
  {
    id: 'F3',
    track: 'foundation',
    level: 'Nền tảng 3 · Vòng lặp Repeat',
    title: 'F3. Vòng lặp: Đi hình vuông và quay về vạch xuất phát',
    mode: '2D',
    mapType: 'custom_blank',
    objective: 'Dùng khối chữ C "repeat (4)" để robot đi một hình vuông cạnh 60 cm và quay về đúng chỗ xuất phát.',
    requirements: [
      'Bắt buộc dùng khối "repeat" — không được xếp 8 khối di chuyển liên tiếp.',
      'Mỗi cạnh dài 60 cm, mỗi góc rẽ trái 90°.'
    ],
    successCriteria: ['Robot về lại vị trí xuất phát (sai số ≤ 15 px)', 'Có dùng khối repeat'],
    theory: [
      'Khi một nhóm lệnh lặp lại giống hệt nhau, hãy đặt chúng vào khối chữ C "repeat (n)".',
      'Chương trình ngắn hơn, dễ sửa hơn: muốn đổi cạnh hình vuông chỉ cần sửa 1 chỗ.',
      'Hình vuông: 4 cạnh, mỗi góc 90° → tổng góc quay 360°.'
    ],
    hints: [
      'Kéo khối "repeat 10" (nhóm Control) vào, đổi số 10 thành 4.',
      'Thả 2 khối vào TRONG miệng chữ C: "move ↑ for 60 cm" và "move [left: -90]".'
    ],
    arenaConfig: {
      startPose: { x: 200, y: 190, angle: 0 },
      lines: [],
      goals: [],
      obstacles: [],
      walls: [],
      colorPatches: [],
      cargos: []
    },
    starterBlocks: [HAT('f3'), MOTORS('f3')],
    solutionBlocks: [
      HAT('f3s'),
      MOTORS('f3s'),
      {
        id: 'f3s_rep',
        type: 'repeat_loop_line_follow',
        params: { times: 4, action: 'none' },
        children: [FWD('f3s1', 60), TURN('f3s2', -90)]
      }
    ],
    winCondition: 'return_to_start',
    winParams: { tolerancePx: 15 },
    requiredBlocks: ['repeat_loop_line_follow']
  },
  {
    id: 'F4',
    track: 'foundation',
    level: 'Nền tảng 4 · Chờ cảm biến (Wait until)',
    title: 'F4. Cảm biến khoảng cách: Dừng trước vật cản',
    mode: '2D',
    mapType: 'sensor_lab',
    objective: 'Robot chạy thẳng và tự dừng lại khi cách vật cản đỏ ≤ 15 cm (không được đâm vào).',
    requirements: [
      'Dùng "start moving" để xe chạy liên tục (không dùng quãng đường cố định).',
      'Dùng "wait until <E is closer than 15 cm?>" rồi "stop moving".'
    ],
    successCriteria: ['Robot dừng cách vật cản ≤ 20 cm', 'Không va chạm', 'Có dùng khối wait until'],
    theory: [
      '"start moving" chỉ BẬT động cơ rồi chạy ngay sang khối tiếp theo — xe vẫn chạy.',
      '"wait until < >" giữ chương trình đứng chờ cho đến khi điều kiện lục giác ĐÚNG.',
      'Đây là kỹ thuật cốt lõi khi thi: không đo quãng đường, để CẢM BIẾN quyết định lúc dừng.'
    ],
    hints: [
      'Khối lục giác "E is closer than 15 % ?" nằm trong nhóm Sensors — kéo thả vào ô < > của wait until.',
      'Đổi đơn vị sang cm và giá trị 15.',
      'Thứ tự: start moving → wait until <...> → stop moving.'
    ],
    starterBlocks: [HAT('f4'), MOTORS('f4')],
    solutionBlocks: [
      HAT('f4s'),
      MOTORS('f4s'),
      { id: 'f4s1', type: 'start_moving', params: { direction: 'forward' } },
      {
        id: 'f4s2',
        type: 'wait_until_sensor',
        params: { port: 'E', condition: 'closer than', value: 15, unit: 'cm' },
        conditionBlock: {
          id: 'f4s2c',
          type: 'sensor_is_closer_than',
          params: { port: 'E', comp: 'closer than', value: 15, unit: 'cm' }
        }
      },
      { id: 'f4s3', type: 'stop_moving', params: {} }
    ],
    winCondition: 'stop_before_obstacle',
    winParams: { maxCm: 20 },
    requiredBlocks: ['wait_until_sensor', 'stop_moving']
  },
  {
    id: 'F5',
    track: 'foundation',
    level: 'Nền tảng 5 · Rẽ nhánh & Cảm biến màu',
    title: 'F5. Cảm biến màu: Chạy qua vạch Đỏ, Vàng và dừng trên vạch Xanh lá',
    mode: '2D',
    mapType: 'sensor_lab',
    objective: 'Robot chạy qua các vạch màu, bật đèn nút nguồn màu ĐỎ khi đi qua vạch đỏ, và dừng đúng trên vạch XANH LÁ.',
    requirements: [
      'Dùng "repeat until <D is color green?>" để lặp cho tới khi gặp màu xanh lá.',
      'Trong vòng lặp: cho xe chạy và dùng "if <D is color red?> then" để bật đèn đỏ.',
      'Sau vòng lặp: dừng xe và phát tiếng bíp.'
    ],
    successCriteria: ['Robot dừng khi cảm biến D đang ở trên vạch XANH LÁ', 'Có dùng repeat until và cảm biến màu'],
    theory: [
      'RẼ NHÁNH: "if < > then" chỉ chạy các khối bên trong khi điều kiện ĐÚNG.',
      '"repeat until < >" lặp lại cho đến khi điều kiện ĐÚNG thì thoát ra.',
      'Cảm biến màu (cổng D) nằm ở mũi robot, nên robot dừng khi MŨI xe chạm vạch.'
    ],
    hints: [
      'Khung: repeat until <D is color [green]?> { start moving ; if <D is color [red]?> then { set Power Button light to red } }',
      'Đặt "stop moving" và "play beep" NGAY SAU (bên ngoài) khối repeat until.'
    ],
    starterBlocks: [HAT('f5'), MOTORS('f5')],
    solutionBlocks: [
      HAT('f5s'),
      MOTORS('f5s'),
      { id: 'f5s0', type: 'set_movement_speed', params: { speed: 40 } },
      {
        id: 'f5s1',
        type: 'repeat_until_block',
        params: {},
        conditionBlock: { id: 'f5s1c', type: 'sensor_is_color', params: { port: 'D', color: 'GREEN' } },
        children: [
          { id: 'f5s2', type: 'start_moving', params: { direction: 'forward' } },
          {
            id: 'f5s3',
            type: 'if_then_block',
            params: {},
            conditionBlock: { id: 'f5s3c', type: 'sensor_is_color', params: { port: 'D', color: 'RED' } },
            children: [{ id: 'f5s4', type: 'set_center_button_light', params: { color: 'RED' } }]
          }
        ]
      },
      { id: 'f5s5', type: 'stop_moving', params: {} },
      { id: 'f5s6', type: 'play_beep_for_seconds', params: { note: 72, seconds: 0.3 } }
    ],
    winCondition: 'stop_on_color',
    winParams: { color: 'GREEN' },
    requiredBlocks: ['repeat_until_block', 'sensor_is_color']
  },
  {
    id: 'F6',
    track: 'foundation',
    level: 'Nền tảng 6 · Dò line 1 cảm biến',
    title: 'F6. Dò line Zíc-zắc (Bang-bang) bám mép vạch đen',
    mode: '2D',
    mapType: 'line_track',
    objective: 'Viết thuật toán dò line 1 cảm biến: robot bám theo mép vạch đen tới vùng FINISH và dừng trước vật cản.',
    requirements: [
      'Dùng "repeat until <E is closer than 25 cm?>".',
      'Bên trong: "if <D reflection < 50 %?> then ... else ..." điều khiển "start moving (steering)" lệch trái/phải.',
      'Sau vòng lặp: stop moving.'
    ],
    successCriteria: ['Robot đi vào vùng FINISH', 'Không va chạm vật cản', 'Có dùng if-else với cảm biến ánh sáng phản xạ'],
    theory: [
      'Vạch đen phản xạ ít ánh sáng (~12%), nền trắng phản xạ nhiều (~98%). Ngưỡng = (12 + 98) / 2 ≈ 50%.',
      'Thuật toán Bang-bang: thấy ĐEN → lái về một phía, thấy TRẮNG → lái về phía kia. Robot sẽ bám MÉP vạch theo đường zíc-zắc.',
      'Lái càng gắt thì bám khúc cua tốt nhưng lắc nhiều; lái nhẹ thì mượt nhưng dễ văng ở khúc cua gắt.',
      'Nâng cao (thi đấu): dò line TỈ LỆ — góc lái = Kp × (reflection − 50) — mượt và nhanh hơn.'
    ],
    hints: [
      'Robot xuất phát ở mép DƯỚI vạch đen. Thấy đen → lái phải (steering dương) để ra mép dưới; thấy trắng → lái trái (steering âm).',
      'Thử steering 30 / −30. Nếu robot văng ra ở khúc cua, tăng lên 45 / −45.',
      'Điều kiện dừng: "E is closer than 25 cm?" đặt vào ô của repeat until.'
    ],
    arenaConfig: {
      startPose: { x: 66, y: 138, angle: -30 },
      lines: [],
      goals: [{ id: 'f6_finish', x: 345, y: 100, w: 70, h: 65, label: 'FINISH' }],
      obstacles: [],
      walls: [],
      colorPatches: [],
      cargos: []
    },
    starterBlocks: [HAT('f6'), MOTORS('f6')],
    solutionBlocks: [
      HAT('f6s'),
      MOTORS('f6s'),
      { id: 'f6s0', type: 'set_movement_speed', params: { speed: 40 } },
      {
        id: 'f6s1',
        type: 'repeat_until_block',
        params: {},
        conditionBlock: {
          id: 'f6s1c',
          type: 'sensor_is_closer_than',
          params: { port: 'E', comp: 'closer than', value: 25, unit: 'cm' }
        },
        children: [
          {
            id: 'f6s2',
            type: 'if_else_block',
            params: {},
            conditionBlock: { id: 'f6s2c', type: 'sensor_is_reflection', params: { port: 'D', comp: '<', value: 50 } },
            children: [{ id: 'f6s3', type: 'start_moving_steering', params: { steering: 40 } }],
            elseChildren: [{ id: 'f6s4', type: 'start_moving_steering', params: { steering: -40 } }]
          }
        ]
      },
      { id: 'f6s5', type: 'stop_moving', params: {} }
    ],
    winCondition: 'reach_goal',
    requiredBlocks: ['if_else_block', 'sensor_is_reflection']
  },
  {
    id: 'F7',
    track: 'foundation',
    level: 'Nền tảng 7 · Điều khiển động cơ đơn & Tay gắp (3D)',
    title: 'F7. Động cơ cổng C: Gắp kiện hàng và đặt lên bệ cao (3D)',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_grab_lift',
    objective: 'Điều khiển tay nâng (cổng C) và tay kẹp để gắp kiện hàng xanh lá, nâng lên và đặt lên bệ vàng.',
    requirements: [
      'Hạ tay xuống (C go to position 10).',
      'Tiến sát kiện hàng, đóng tay kẹp (go to relative position +90).',
      'Nâng tay (C go to position 75), tiến tới bệ vàng, mở tay kẹp (−90).'
    ],
    successCriteria: ['Kiện hàng nằm trên bệ vàng', 'Có dùng khối điều khiển vị trí động cơ C'],
    theory: [
      '"C go [shortest path] to position (x)" quay động cơ tới GÓC TUYỆT ĐỐI x° — dùng cho tay nâng (cùng một vị trí mỗi lần).',
      '"C go to relative position (±90)" quay THÊM ±90° so với vị trí hiện tại — dùng đóng/mở tay kẹp.',
      'Trình tự gắp chuẩn khi thi: Hạ → Tiến → Kẹp → Nâng → Di chuyển → Thả.'
    ],
    hints: [
      'Robot chỉ cần tiến khoảng 14 cm là tay kẹp chạm kiện hàng.',
      'Từ chỗ gắp tới bệ vàng khoảng 79 cm.',
      'Có thể bấm thử các nút "Hạ / Đóng gắp / Nâng / Tiến" ở thanh dưới sa bàn 3D để ước lượng.'
    ],
    starterBlocks: [HAT('f7'), MOTORS('f7')],
    solutionBlocks: [
      HAT('f7s'),
      MOTORS('f7s'),
      CPOS('f7s1', 10),
      FWD('f7s2', 14),
      GRIP('f7s3', 90),
      CPOS('f7s4', 75),
      FWD('f7s5', 79),
      GRIP('f7s6', -90)
    ],
    winCondition: 'cargo_in_zone',
    winParams: { targetCargo: 1 },
    requiredBlocks: ['motor_go_to_position', 'more_motor_go_relative']
  },

  // ============================== 🎯 NHIỆM VỤ ỨNG DỤNG ==============================
  {
    id: 'M1',
    track: 'mission',
    level: 'Nhiệm vụ 1 · Mê cung góc vuông',
    title: 'M1. Thoát mê cung: Tới ô GOAL không chạm tường',
    mode: '2D',
    mapType: 'maze',
    objective: 'Lập trình xe robot từ ô START đi qua hành lang mê cung vào ô GOAL mà không chạm tường.',
    requirements: ['Chỉ dùng các khối di chuyển quãng đường và rẽ góc.', 'Không chạm tường.'],
    successCriteria: ['Robot dừng trong ô GOAL', 'Không va chạm tường'],
    hints: [
      'Đi thẳng sang phải cho tới khi vượt qua bức tường dọc ở giữa (X ≈ 230).',
      'Rẽ phải 90° rồi đi xuống ô GOAL.',
      'Đi thẳng ≈ 140 cm, rẽ phải 90°, đi ≈ 110 cm.'
    ],
    starterBlocks: [HAT('m1'), MOTORS('m1')],
    solutionBlocks: [HAT('m1s'), MOTORS('m1s'), FWD('m1s1', 140), TURN('m1s2', 90), FWD('m1s3', 110)],
    winCondition: 'reach_goal'
  },
  {
    id: 'M2',
    track: 'mission',
    level: 'Nhiệm vụ 2 · Né vật cản Slalom',
    title: 'M2. Luồn lách Zíc-zắc qua 3 trụ để về GOAL',
    mode: '2D',
    mapType: 'slalom_obstacles',
    objective: 'Đi vòng DƯỚI trụ 1, TRÊN trụ 2, DƯỚI trụ 3 rồi vào ô GOAL, không chạm trụ nào.',
    requirements: ['Đi đúng thứ tự dưới – trên – dưới.', 'Không chạm trụ.'],
    successCriteria: ['Robot vào ô GOAL', 'Không va chạm'],
    hints: [
      'Vẽ trước đường đi trên giấy, chia thành các đoạn thẳng nối các điểm.',
      'Dùng tọa độ: góc rẽ = atan(Δy/Δx), quãng đường = √(Δx²+Δy²) / 1.1 cm.',
      'Các điểm gợi ý: (150,165) → (220,165) → (250,100) → (330,100) → (365,165) → (430,165) → GOAL.'
    ],
    starterBlocks: [HAT('m2'), MOTORS('m2')],
    solutionBlocks: [
      HAT('m2s'),
      MOTORS('m2s'),
      TURN('m2s1', 24),
      FWD('m2s2', 75),
      TURN('m2s3', -24),
      FWD('m2s4', 64),
      TURN('m2s5', -65),
      FWD('m2s6', 65),
      TURN('m2s7', 65),
      FWD('m2s8', 73),
      TURN('m2s9', 62),
      FWD('m2s10', 67),
      TURN('m2s11', -62),
      FWD('m2s12', 59),
      TURN('m2s13', -37),
      FWD('m2s14', 50)
    ],
    winCondition: 'reach_goal'
  },
  {
    id: 'M3',
    track: 'mission',
    level: 'Nhiệm vụ 3 · Bãi đỗ xe tự động',
    title: 'M3. Tự đỗ xe vào chuồng trống P2',
    mode: '2D',
    mapType: 'parking_garage',
    objective: 'Chạy dọc làn đường, rẽ trái và đỗ gọn vào chuồng trống P2 (không chạm xe ở P1, P3).',
    requirements: ['Đỗ vào đúng chuồng P2.', 'Không chạm xe khác.'],
    successCriteria: ['Robot nằm trong chuồng P2', 'Không va chạm'],
    hints: ['Tâm chuồng P2 ở X ≈ 279.', 'Đi thẳng ≈ 195 cm, rẽ trái 90°, tiến ≈ 97 cm.'],
    starterBlocks: [HAT('m3'), MOTORS('m3')],
    solutionBlocks: [HAT('m3s'), MOTORS('m3s'), FWD('m3s1', 195), TURN('m3s2', -90), FWD('m3s3', 97)],
    winCondition: 'reach_goal',
    winParams: { goalIds: ['P2'] }
  },
  {
    id: 'M4',
    track: 'mission',
    level: 'Nhiệm vụ 4 · Xe nâng Forklift (3D)',
    title: 'M4. Xe nâng Forklift: Xếp pallet lên kệ kho',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_forklift_pallet',
    objective: 'Hạ càng nâng, nâng pallet cam lên cao, chở tới kệ kho và hạ xuống đặt lên tầng 2.',
    requirements: ['Càng nâng điều khiển bằng động cơ C (góc > 45° là đang nâng).', 'Pallet phải nằm trên kệ.'],
    successCriteria: ['Pallet nằm trong vùng kệ kho'],
    hints: ['Hạ càng xuống 10° rồi nâng lên 78° để nhấc pallet.', 'Tiến ≈ 78 cm rồi hạ càng về 40° để đặt hàng.'],
    starterBlocks: [HAT('m4'), MOTORS('m4')],
    solutionBlocks: [HAT('m4s'), MOTORS('m4s'), CPOS('m4s1', 10), CPOS('m4s2', 78), FWD('m4s3', 78), CPOS('m4s4', 40)],
    winCondition: 'cargo_in_zone',
    winParams: { targetCargo: 1 }
  },
  {
    id: 'M5',
    track: 'mission',
    level: 'Nhiệm vụ 5 · Phân loại hàng theo màu (3D)',
    title: 'M5. Gắp kiện hàng XANH LÁ đặt vào ô đích XANH LÁ',
    mode: '3D',
    mapType: '3d_mission',
    scene3DType: '3d_drag_drop_sorting',
    objective: 'Gắp đúng kiện hàng xanh lá ở giữa và đặt vào ô đích cùng màu.',
    requirements: ['Kiện hàng phải vào ô ĐÚNG MÀU mới được tính.'],
    successCriteria: ['1 kiện hàng nằm trong ô đích đúng màu'],
    hints: ['Tiến ≈ 9 cm rồi đóng tay kẹp.', 'Nâng tay lên 50°, tiến ≈ 75 cm rồi mở kẹp.'],
    starterBlocks: [HAT('m5'), MOTORS('m5')],
    solutionBlocks: [
      HAT('m5s'),
      MOTORS('m5s'),
      CPOS('m5s1', 10),
      FWD('m5s2', 9),
      GRIP('m5s3', 90),
      CPOS('m5s4', 50),
      FWD('m5s5', 75),
      GRIP('m5s6', -90)
    ],
    winCondition: 'cargo_in_zone',
    winParams: { targetCargo: 1 }
  },

  // ============================== 🏆 LUYỆN THI FLL / WRO ==============================
  {
    id: 'C1',
    track: 'competition',
    level: 'FLL · Chạy nhiều trạm',
    title: 'C1. FLL: Rời Launch Area, ghé M01 rồi tới M02',
    mode: '2D',
    mapType: 'fll_challenge',
    objective: 'Xuất phát trong Launch Area, đi vào trạm M01 (Solar) TRƯỚC, sau đó tới trạm M02 (Drop).',
    requirements: ['Đúng thứ tự M01 → M02.', 'Dừng trong M02.'],
    successCriteria: ['Đã đi qua M01 rồi mới tới M02'],
    hints: [
      'Đi theo vạch đen: thẳng tới chỗ vạch rẽ lên (X ≈ 250).',
      'Lên tới M01 (Y ≈ 55), rẽ phải đi thẳng sang M02.'
    ],
    starterBlocks: [HAT('c1'), MOTORS('c1')],
    solutionBlocks: [
      HAT('c1s'),
      MOTORS('c1s'),
      FWD('c1s1', 176),
      TURN('c1s2', -90),
      FWD('c1s3', 136),
      TURN('c1s4', 90),
      FWD('c1s5', 185)
    ],
    winCondition: 'visit_in_order',
    winParams: { goalIds: ['M01', 'M02'] },
    lockSolution: true
  },
  {
    id: 'C2',
    track: 'competition',
    level: 'WRO · Đô thị thông minh',
    title: 'C2. WRO Smart City: Ghé PARK rồi về SMART HUB',
    mode: '2D',
    mapType: 'wro_smart_city',
    objective: 'Đi theo đường phố tới trạm PARK (xanh lá), quay lại trục chính rồi về SMART HUB.',
    requirements: ['Đúng thứ tự PARK → SMART HUB.'],
    successCriteria: ['Đã ghé PARK trước khi tới SMART HUB'],
    hints: ['Ngã tư thứ 2 ở X ≈ 350.', 'Từ PARK quay đầu 180° rồi xuống lại trục chính.'],
    starterBlocks: [HAT('c2'), MOTORS('c2')],
    solutionBlocks: [
      HAT('c2s'),
      MOTORS('c2s'),
      FWD('c2s1', 264),
      TURN('c2s2', -90),
      FWD('c2s3', 92),
      TURN('c2s4', 180),
      FWD('c2s5', 92),
      TURN('c2s6', -90),
      FWD('c2s7', 106)
    ],
    winCondition: 'visit_in_order',
    winParams: { goalIds: ['PARK', 'SMART_HUB'] },
    lockSolution: true
  },
  {
    id: 'C3',
    track: 'competition',
    level: 'RoboCup Junior · Rescue Line',
    title: 'C3. Rescue Line: Theo đường gấp khúc tới SAFE POINT',
    mode: '2D',
    mapType: 'rescue_line',
    objective: 'Đi theo đường line gấp khúc (có marker xanh ở các góc) tới điểm cứu hộ SAFE POINT.',
    requirements: ['Đến được SAFE POINT.', 'Thử thách nâng cao: dùng thuật toán dò line thay vì đo quãng đường.'],
    successCriteria: ['Robot vào SAFE POINT'],
    hints: [
      'Đường có 4 góc vuông: phải → lên → phải → xuống → phải.',
      'Cách 1: đo quãng đường từng đoạn. Cách 2 (khó): dò line + phát hiện marker xanh để rẽ.'
    ],
    starterBlocks: [HAT('c3'), MOTORS('c3')],
    solutionBlocks: [
      HAT('c3s'),
      MOTORS('c3s'),
      FWD('c3s1', 82),
      TURN('c3s2', -90),
      FWD('c3s3', 118),
      TURN('c3s4', 90),
      FWD('c3s5', 127),
      TURN('c3s6', 90),
      FWD('c3s7', 105),
      TURN('c3s8', -90),
      FWD('c3s9', 138)
    ],
    winCondition: 'reach_goal',
    winParams: { goalIds: ['SAFE'] },
    lockSolution: true
  },

  // ============================== 🛠 SA BÀN TỰ DO ==============================
  {
    id: 'S1',
    track: 'sandbox',
    level: 'Sa bàn tự do',
    title: 'S1. Sa bàn tự do — Tự vẽ line, đặt đích & vật cản',
    mode: '2D',
    mapType: 'custom_blank',
    objective: 'Bấm "🛠 Thiết Kế Sa Bàn" để tự vẽ đường đi, đặt GOAL/vật cản rồi lập trình robot về đích.',
    requirements: ['Tự thiết kế sa bàn và tự đặt thử thách cho bạn bên cạnh.'],
    successCriteria: ['Robot vào một ô GOAL', 'Không va chạm'],
    hints: ['Dùng công cụ "Kẻ Đoạn Thẳng" để vẽ đường gấp khúc chính xác.'],
    allowStudentArenaEdit: true,
    arenaConfig: {
      startPose: { x: 65, y: 132, angle: 0 },
      lines: [
        {
          id: 's1_line',
          points: [
            { x: 65, y: 132 },
            { x: 150, y: 132 },
            { x: 220, y: 85 },
            { x: 310, y: 85 },
            { x: 375, y: 155 },
            { x: 440, y: 155 }
          ],
          color: '#0f172a',
          colorName: 'BLACK',
          width: 14
        }
      ],
      goals: [{ id: 's1_goal', x: 415, y: 130, w: 62, h: 50, label: 'GOAL' }],
      obstacles: [{ id: 's1_obs', x: 250, y: 160, w: 32, h: 36, label: 'OBS' }],
      walls: [],
      colorPatches: [],
      cargos: []
    },
    starterBlocks: [HAT('s1'), MOTORS('s1')],
    solutionBlocks: [HAT('s1s'), MOTORS('s1s')],
    winCondition: 'reach_goal'
  }
];

// Chuyển bài cũ (chỉ có defaultBlocks) sang cấu trúc mới
export function migrateMission(m) {
  if (!m) return m;
  const out = { ...m };
  if (!out.track) out.track = out.isCustom ? 'sandbox' : 'mission';
  if (!out.solutionBlocks) out.solutionBlocks = out.defaultBlocks || [];
  if (!out.starterBlocks) {
    out.starterBlocks = out.isCustom && out.defaultBlocks ? out.defaultBlocks : [
      { id: `${out.id}_hat`, type: 'when_program_starts', params: {} }
    ];
  }
  if (!out.requirements) out.requirements = out.steps || [];
  if (!out.successCriteria) out.successCriteria = [];
  if (!out.hints) out.hints = [];
  if (!out.winCondition) out.winCondition = 'run_complete';
  return out;
}
