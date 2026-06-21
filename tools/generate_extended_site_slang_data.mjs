import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data", "workplace-translation-mvp");
mkdirSync(dataDir, { recursive: true });

const sources = [
  {
    title: "EPS Employment Permit System official page",
    url: "https://www.eps.go.kr/eo/EmployPerSystem.eo?tabGb=01",
    note: "Used for workplace-domain scope: construction, manufacturing, logistics, agriculture, fisheries, waste, service expansion."
  },
  {
    title: "Occupational Safety and Health Standards Rules",
    url: "https://www.law.go.kr/법령/산업안전보건기준에관한규칙",
    note: "Used for safety context around fall prevention, machine guarding, electricity, lifting, fire, chemicals, and confined spaces."
  },
  {
    title: "Field terminology seed",
    url: "local-field-review-needed",
    note: "Japanese-derived and informal Korean workplace terms are highly regional. This dataset is a seed for ASR/glossary correction and requires field/native review before safety-critical deployment."
  }
];

const terms = [
  ["SL001","데스라",["데스라","데스리","데쓰리","데스리 난간"],"construction_slang","high","난간, 손잡이, 추락을 막는 가드레일을 뜻하는 현장 은어로 추정됩니다.","난간 또는 가드레일","lan can hoặc thanh chắn an toàn","ราวกันตกหรือราวจับนิรภัย","pagar pengaman atau pegangan tangan","सुरक्षा रेलिङ वा समात्ने रेल","របាំងសុវត្ថិភាព ឬ ដៃចាប់",["대수라","데쓰라","데스 리"],"Do not transliterate. In fall-prevention context, translate as guardrail.","medium_low",true],
  ["SL002","스미마끼",["스미마끼","스미마키","스미다시","스미내기","먹매김","먹줄"],"construction_slang","normal","시공 위치를 표시하기 위해 바닥이나 벽에 먹줄/선을 치는 작업입니다.","먹매김 또는 기준선 표시","đánh dấu đường mực/đường chuẩn thi công","ตีเส้นกำหนดแนวงานก่อสร้าง","menandai garis acuan pekerjaan","कामको आधार रेखा चिन्ह लगाउने","គូសខ្សែសម្គាល់ខ្សែមូលដ្ឋានការងារ",["수미마끼","스미 막기","스미마키"],"Translate as layout marking/chalk line marking.","medium",true],
  ["SL003","나라시",["나라시","나라시 작업","면 고르기","평탄화","레벨링"],"construction_manufacturing_slang","normal","바닥, 콘크리트, 흙, 자재 표면 등을 평평하게 고르는 작업입니다.","평탄화 또는 면 고르기","san phẳng hoặc làm phẳng bề mặt","ปรับระดับหรือเกลี่ยพื้นผิวให้เรียบ","meratakan atau menghaluskan permukaan","सतह सम्याउने वा लेभल मिलाउने","កែសម្រួលកម្រិត ឬ ធ្វើឱ្យផ្ទៃរាបស្មើ",["나라시해","나라 시","나라씨"],"Translate by task: leveling/smoothing. Adapt to concrete, soil, or product-surface context.","high",false],
  ["SL004","바라시",["바라시","바라시하다","해체","뜯어내기"],"construction_slang","high","거푸집, 비계, 설비, 포장 등을 해체하거나 뜯어내는 작업입니다.","해체 또는 제거","tháo dỡ hoặc tháo ra","รื้อถอนหรือถอดออก","membongkar atau melepas","खोल्ने वा हटाउने","រុះរើ ឬ ដោះចេញ",["바라시 해","바라시해"],"Translate as dismantle/remove, not as scatter.","high",false],
  ["SL005","하스리",["하스리","하쓰리","치핑","까내기","할석"],"construction_slang","high","콘크리트나 벽면을 깨거나 까내는 작업입니다.","콘크리트 깨기 또는 표면 까내기","đục phá bê tông hoặc đục bề mặt","สกัดคอนกรีตหรือกะเทาะผิว","memahat/membobok beton atau permukaan","कंक्रिट फोड्ने वा सतह काट्ने","កាប់/ច្រេះបេតុង ឬ ផ្ទៃ",["하스리해","하쓰리"],"Translate as concrete chipping/breaking. Include dust/noise hazard when relevant.","medium",true],
  ["SL006","기리바리",["기리바리","기리빠리","버팀대","가새","동바리"],"construction_slang","high","무너지지 않도록 임시로 받치거나 버티는 부재입니다.","임시 버팀대 또는 가새","thanh chống tạm hoặc giằng chống","ค้ำยันชั่วคราวหรือค้ำเฉียง","penyangga sementara atau bracing","अस्थायी टेको वा ब्रेसिङ","ទ្រនាប់បណ្តោះអាសន្ន ឬ ឈើទប់",["기리 바리","기리빠리"],"Translate as temporary bracing/support. If structural safety context, preserve support/fall-collapse meaning.","medium",true],
  ["SL007","아시바",["아시바","아시바 비계","비계"],"construction_slang","critical","높은 곳 작업을 위한 임시 구조물인 비계를 뜻하는 은어입니다.","비계","giàn giáo","นั่งร้าน","perancah","स्क्याफोल्डिङ","រន្ទា",["아시봐","아시바"],"Translate as scaffold/scaffolding, never as a place name.","high",false],
  ["SL008","오야지",["오야지","오야","반장","현장반장"],"site_slang","normal","현장 책임자나 반장을 가리키는 비공식 표현입니다.","현장 반장 또는 책임자","tổ trưởng hoặc người phụ trách hiện trường","หัวหน้างานหรือผู้รับผิดชอบหน้างาน","mandor atau penanggung jawab lapangan","साइट फोरम्यान वा जिम्मेवार व्यक्ति","មេការ ឬ អ្នកទទួលខុសត្រូវការដ្ឋាន",["오야지한테","오야한테"],"Translate neutrally as supervisor/foreman. Avoid slang tone in target language.","high",false],
  ["SL009","데모도",["데모도","조공","보조공","보조"],"site_slang","normal","기술자를 보조하는 보조 작업자를 뜻하는 표현입니다.","보조 작업자","thợ phụ hoặc người hỗ trợ","ผู้ช่วยงาน","pekerja pembantu","सहायक कामदार","កម្មករជំនួយ",["대모도","데모도"],"Translate as helper/assistant worker. Avoid demeaning wording.","medium",true],
  ["SL010","곰방",["곰방","곰방 작업","인력운반","손운반"],"construction_slang","high","자재나 짐을 사람이 직접 들고 옮기는 작업입니다.","인력 운반","vận chuyển thủ công bằng người","ขนย้ายด้วยแรงคน","pengangkutan manual","मान्छेले बोकेर सार्ने काम","ដឹកជញ្ជូនដោយកម្លាំងមនុស្ស",["곰방해","곰 방"],"Translate as manual carrying/handling. Include heavy-load warning if weight is mentioned.","high",false],
  ["SL011","단도리",["단도리","단도리하다","준비","작업준비"],"site_slang","normal","작업을 시작하기 전에 필요한 준비와 정리를 하는 것입니다.","작업 준비","chuẩn bị công việc","เตรียมงาน","persiapan kerja","कामको तयारी","ការរៀបចំការងារ",["단돌이","단도리 해"],"Translate as preparation/setup, not as command to hurry.","high",false],
  ["SL012","시마이",["시마이","시마이하다","마감","끝내기"],"site_slang","normal","작업을 끝내거나 마감하는 것을 뜻하는 표현입니다.","작업 종료 또는 마감","kết thúc hoặc hoàn thiện công việc","จบงานหรือเก็บงาน","menyelesaikan/menutup pekerjaan","काम सक्ने वा अन्तिम मिलाउने","បញ្ចប់ ឬ បិទការងារ",["시마이해","시마이 치자"],"Translate as finish/close out work. In finishing-trade context, use finish work.","high",false],
  ["SL013","유도리",["유도리","여유","허용오차"],"site_slang","normal","작업 치수나 일정에서 약간의 여유를 뜻하는 표현입니다.","여유 또는 허용오차","khoảng dư hoặc dung sai","ระยะเผื่อหรือค่าคลาดเคลื่อนที่ยอมรับได้","kelonggaran atau toleransi","छुट वा सहनशीलता","ចន្លោះបន្ថែម ឬ កម្រិតអនុញ្ញាត",["유도리 있게"],"Translate as tolerance/allowance in technical context, flexibility in schedule context.","medium",true],
  ["SL014","구루마",["구루마","손수레","대차","카트"],"site_slang","high","물건을 싣고 미는 손수레나 대차입니다.","손수레 또는 대차","xe đẩy tay hoặc xe đẩy hàng","รถเข็นหรือรถเข็นของ","troli atau gerobak dorong","ठेलागाडी वा ट्रली","រទេះរុញ ឬ ត្រូលី",["구르마","구루마 끌어"],"Translate as handcart/trolley.","high",false],
  ["SL015","빠루",["빠루","바루","쇠지렛대","지렛대"],"site_slang","high","못을 빼거나 물건을 들어 올리는 쇠지렛대입니다.","쇠지렛대","xà beng","ชะแลง","linggis","फलामे लिभर/क्राउबार","ដែកគាស់",["파루","빠루로"],"Translate as crowbar/pry bar. In safety context, warn about pinch/strike hazard.","high",false],
  ["SL016","빠렛트",["빠렛트","파렛트","팔레트"],"logistics_slang","high","화물을 올려 운반하는 받침대입니다.","팔레트","pallet","พาเลท","palet","प्यालेट","ប៉ាឡែត",["빠레트","파레트"],"Normalize to pallet before translation.","high",false],
  ["SL017","공구리",["공구리","콘크리트","레미콘"],"construction_slang","normal","콘크리트를 뜻하는 현장 표현입니다.","콘크리트","bê tông","คอนกรีต","beton","कंक्रिट","បេតុង",["공구리쳐","공구리 타설"],"Translate as concrete. If action is pour/place, translate full action as concrete pouring.","high",false],
  ["SL018","메지",["메지","줄눈","이음새","틈"],"construction_slang","normal","타일, 블록, 콘크리트 사이의 줄눈이나 이음새입니다.","줄눈 또는 이음새","mạch nối hoặc khe nối","ร่องยาแนวหรือรอยต่อ","nat atau sambungan","जोडाइको खाली ठाउँ/जोइन्ट","ចន្លោះតភ្ជាប់ ឬ ស្នាមតភ្ជាប់",["메지 넣어","메지 파"],"Translate as joint/grout joint depending on tile/concrete context.","medium",true],
  ["SL019","고바이",["고바이","구배","물매","경사"],"construction_slang","normal","물이 흐르도록 만든 바닥이나 배관의 기울기입니다.","경사 또는 구배","độ dốc","ความลาดเอียง","kemiringan","ढलान","ជម្រាល",["구바이","고바이 줘"],"Translate as slope/gradient. If drainage context, use drainage slope.","medium",true],
  ["SL020","다데",["다데","세로","수직"],"construction_slang","normal","세로 방향 또는 수직 방향을 뜻하는 현장 표현입니다.","세로 또는 수직","chiều dọc hoặc thẳng đứng","แนวตั้ง","vertikal","ठाडो दिशा","ទិសបញ្ឈរ",["다대","다데로"],"Translate as vertical direction.","medium",true],
  ["SL021","요코",["요코","가로","수평"],"construction_slang","normal","가로 방향 또는 수평 방향을 뜻하는 현장 표현입니다.","가로 또는 수평","chiều ngang hoặc nằm ngang","แนวนอน","horizontal","तेर्सो दिशा","ទិសផ្ដេក",["요꼬","요코로"],"Translate as horizontal direction.","medium",true],
  ["SL022","하리",["하리","보","빔"],"construction_slang","high","건축 구조에서 하중을 받는 보 또는 빔을 뜻하는 표현입니다.","보 또는 빔","dầm","คาน","balok struktur","बिम","ធ្នឹម",["하리 밑","하리 설치"],"Translate as structural beam, not as generic line.","medium",true],
  ["SL023","기소",["기소","기초","기초공사"],"construction_slang","high","건물이나 설비를 받치는 기초 부분 또는 기초공사입니다.","기초 또는 기초공사","móng hoặc công tác móng","ฐานรากหรืองานฐานราก","fondasi atau pekerjaan fondasi","जग वा जगको काम","គ្រឹះ ឬ ការងារគ្រឹះ",["기소 작업"],"Translate as foundation/foundation work.","medium",true],
  ["SL024","가다",["가다","형틀","틀","본"],"construction_manufacturing_slang","normal","모양이나 치수를 맞추기 위한 틀이나 기준본을 뜻하는 표현입니다.","형틀 또는 기준본","khuôn mẫu hoặc mẫu chuẩn","แบบหรือแม่แบบ","pola/cetakan acuan","ढाँचा वा नमूना", "ពុម្ព ឬ គំរូ",["가다 떠","가다 잡아"],"Translate as template/form depending on context. Mark uncertain if sentence is ambiguous.","medium_low",true],
  ["SL025","기스",["기스","스크래치","긁힘"],"quality_slang","normal","제품 표면이 긁힌 자국입니다.","긁힘","vết xước","รอยขีดข่วน","goresan","कोरिएको दाग","ស្នាមឆ្កូត",["기스났어","기스남"],"Translate as scratch in quality context.","high",false],
  ["SL026","빵꾸",["빵꾸","구멍","펑크","누락"],"site_slang","normal","문맥에 따라 구멍, 펑크, 일정/인원 누락을 뜻합니다.","구멍 또는 누락","lỗ thủng hoặc thiếu người/thiếu việc","รูรั่วหรือขาดคน/ขาดงาน","lubang/bocor atau kekurangan orang","प्वाल वा मान्छे/कामको कमी","រន្ធ ឬ ខ្វះមនុស្ស/ការងារ",["빵구","빵꾸났어"],"Use context: material=torn/hole, tire=puncture, staffing=schedule gap.","medium",true],
  ["SL027","빠꾸",["빠꾸","반품","되돌림","후진","재작업"],"site_slang","normal","문맥에 따라 되돌림, 반품, 후진, 재작업을 뜻합니다.","되돌림 또는 재작업","trả lại/quay lại hoặc làm lại","ส่งกลับ/ถอยหลังหรือแก้งาน","kembali/retur atau kerja ulang","फिर्ता वा पुन: काम","ត្រឡប់វិញ ឬ ធ្វើឡើងវិញ",["빠꾸해","빠꾸났어"],"Use context: vehicle=reverse, product=return/reject, work=rework.","medium",true],
  ["SL028","땜빵",["땜빵","대체투입","임시대체"],"site_slang","normal","빈자리를 임시로 메우는 사람이나 작업입니다.","임시 대체","người/thao tác thay thế tạm thời","คนหรือการทำงานแทนชั่วคราว","pengganti sementara","अस्थायी सट्टा/बदली","អ្នកជំនួសបណ្តោះអាសន្ន",["땜방","땜빵쳐"],"Translate neutrally as temporary replacement/cover. Avoid slang tone.","high",false],
  ["SL029","야리끼리",["야리끼리","물량 끝내기","작업량 완료 후 종료"],"site_slang","normal","정해진 물량을 끝내면 일찍 마치는 방식입니다.","정해진 작업량 완료 후 종료","kết thúc sau khi hoàn thành khối lượng đã giao","เลิกงานเมื่อทำปริมาณงานที่กำหนดเสร็จ","selesai setelah target pekerjaan selesai","तोकिएको काम सकेपछि समाप्त","បញ្ចប់បន្ទាប់ពីធ្វើបរិមាណការងារបានរួច",["야리키리","야리끼리야"],"Translate by labor arrangement, not literally.","medium",true],
  ["SL030","함바",["함바","현장식당","식당"],"site_slang","normal","건설현장이나 작업장 주변 식당입니다.","현장 식당","nhà ăn công trường","โรงอาหารหน้างาน","kantin lokasi kerja","साइट क्यान्टिन","អាហារដ្ឋានការដ្ឋាន",["함바집","함바 가"],"Translate as site canteen/cafeteria.","high",false],
  ["SL031","아나방",["아나방","구멍뚫기","코어작업","천공"],"construction_slang","high","벽, 바닥, 콘크리트 등에 구멍을 뚫는 작업을 뜻하는 표현으로 쓰일 수 있습니다.","천공 또는 코어 작업","khoan lỗ hoặc khoan rút lõi","เจาะรูหรือเจาะคอร์","pengeboran lubang atau coring","प्वाल पार्ने वा कोर ड्रिलिङ","ខួងរន្ធ ឬ ខួងយកក័រ",["아나바","아나방 해"],"Field meaning varies. Prefer drilling/coring only if context includes holes, wall, slab, pipe opening.","low",true],
  ["SL032","메꾸라",["메꾸라","막음","마개","블라인드"],"construction_manufacturing_slang","normal","구멍이나 배관 끝을 임시 또는 영구적으로 막는 부품/조치입니다.","마개 또는 막음","nút bịt hoặc bịt kín","จุกปิดหรือการปิดรู","sumbat atau penutup","बन्द गर्ने प्लग वा ढकनी","គម្របបិទ ឬ ដោតបិទ",["메꾸라 쳐","메꾸라캡"],"Translate as plug/cap/blanking depending on pipe or hole context.","medium_low",true],
  ["SL033","오함마",["오함마","큰 망치","대형망치"],"site_slang","high","콘크리트나 구조물을 치는 큰 망치입니다.","대형 망치","búa tạ","ค้อนปอนด์","palu godam","ठूलो हथौडा","ញញួរធំ",["오함마질","오함마로"],"Translate as sledgehammer. Include strike hazard if used as instruction.","high",false],
  ["SL034","함마드릴",["함마드릴","해머드릴","진동드릴"],"site_slang","high","콘크리트 등에 구멍을 뚫는 충격 드릴입니다.","해머드릴","máy khoan búa","สว่านกระแทก","bor palu","ह्यामर ड्रिल","ម៉ាស៊ីនខួងញ័រ",["하마드릴","함마 드릴"],"Translate as hammer drill.","high",false],
  ["SL035","구배잡다",["구배잡다","물매잡다","경사 맞추다"],"construction_slang","normal","물이 흐르도록 바닥이나 배관의 기울기를 맞추는 작업입니다.","경사를 맞추다","tạo độ dốc đúng","ปรับความลาดเอียงให้ถูกต้อง","mengatur kemiringan","ढलान मिलाउनु","កែជម្រាលឱ្យត្រឹមត្រូវ",["고바이 잡아","구배 봐"],"Translate as set/check slope, especially for drainage.","medium",true],
  ["SL036","레벨보다",["레벨보다","수평보다","레벨 확인"],"construction_slang","normal","수평이나 높이가 맞는지 확인하는 작업입니다.","수평 또는 높이 확인","kiểm tra cao độ hoặc độ bằng phẳng","ตรวจระดับหรือความสูง","memeriksa level/ketinggian","लेभल वा उचाइ जाँच्नु","ពិនិត្យកម្រិត ឬ កម្ពស់",["레벨 봐","레벨봐"],"Translate as check level/elevation.","high",false],
  ["SL037","먹놓다",["먹놓다","먹줄치다","기준선 표시"],"construction_slang","normal","먹줄로 기준선을 표시하는 작업입니다.","먹줄로 기준선을 표시하다","bật dây mực để đánh dấu đường chuẩn","ตีเส้นด้วยเชือกหมึก","menandai garis dengan benang tinta","मसी डोरीले रेखा चिन्ह लगाउनु","គូសខ្សែដោយខ្សែទឹកខ្មៅ",["먹 놔","먹 쳐"],"Translate as snap chalk/ink line. Link to 스미마끼.","high",false],
  ["SL038","가라",["가라","가짜","임시","대충"],"site_slang","normal","문맥에 따라 가짜, 임시, 대충 처리라는 부정적 의미가 있습니다.","가짜 또는 임시 처리","giả hoặc xử lý tạm bợ","ของปลอมหรือทำชั่วคราวแบบลวกๆ","palsu atau pengerjaan sementara/asalan","नक्कली वा अस्थायी/लापरवाही काम","ក្លែងក្លាយ ឬ ធ្វើបណ្តោះអាសន្នមិនរឹងមាំ",["가라로","가라 작업"],"Use caution. If safety/quality context, translate as improper temporary/fake work, not neutral temporary work.","medium",true],
  ["SL039","조지다",["조지다","세게 하다","망치다","처리하다"],"site_slang","normal","문맥에 따라 세게 작업하다, 망치다, 빨리 처리하다 등 의미가 달라지는 거친 표현입니다.","문맥에 따라 강하게 작업하거나 망치다","làm mạnh tay hoặc làm hỏng tùy ngữ cảnh","ทำแรงๆ หรือทำเสีย ขึ้นกับบริบท","mengerjakan keras atau merusak, tergantung konteks","सन्दर्भअनुसार जोडले गर्नु वा बिगार्नु","អាស្រ័យលើបរិបទ អាចមានន័យថាធ្វើខ្លាំង ឬ ធ្វើខូច",["조져","조졌어"],"Do not translate literally. Prefer neutral operational meaning; flag as ambiguous.","low",true],
  ["SL040","쪼인트",["쪼인트","조인트","이음","연결부"],"construction_manufacturing_slang","normal","자재나 배관 등이 서로 이어지는 연결부입니다.","이음부 또는 연결부","mối nối hoặc điểm nối","รอยต่อหรือจุดเชื่อมต่อ","sambungan atau titik koneksi","जोड्ने भाग","ចំណុចតភ្ជាប់",["조인트 봐","쪼인트"],"Normalize to joint/connection.","high",false],
  ["SL041","빠데",["빠데","퍼티","메움재"],"construction_manufacturing_slang","normal","틈이나 흠집을 메우는 퍼티/충전재입니다.","퍼티 또는 메움재","bột trét hoặc vật liệu trám","โป๊วหรือวัสดุอุด","dempul atau bahan pengisi","पुट्टी वा भर्ने सामग्री","ប៉ូតទី ឬ សម្ភារៈបំពេញ",["빠대","빠데질"],"Translate as putty/filler; in paint context use puttying.","medium",true],
  ["SL042","빠데질",["빠데질","퍼티작업","메움작업"],"construction_manufacturing_slang","normal","흠집이나 틈을 퍼티로 메우고 다듬는 작업입니다.","퍼티 작업","trét bột/thi công putty","งานโป๊ว","pekerjaan dempul","पुट्टी लगाउने काम","ការងារប៉ូតទី",["빠대질"],"Translate as puttying/filling work.","medium",true],
  ["SL043","기리",["기리","드릴날","비트"],"manufacturing_slang","high","드릴에 끼워 구멍을 뚫는 날 또는 비트입니다.","드릴 비트","mũi khoan","ดอกสว่าน","mata bor","ड्रिल बिट","មុខខួង",["기리 갈아","기리 바꿔"],"Translate as drill bit, not drill machine unless context says tool body.","medium",true],
  ["SL044","다마",["다마","볼","구슬","전구"],"site_slang","normal","문맥에 따라 볼, 구슬, 전구 등을 뜻할 수 있는 일본어계 표현입니다.","볼, 구슬 또는 전구","bi/viên hoặc bóng đèn tùy ngữ cảnh","ลูกกลมหรือหลอดไฟ ขึ้นกับบริบท","bola/butir atau lampu, tergantung konteks","सन्दर्भअनुसार बल/गोटी वा बल्ब","អាស្រ័យលើបរិបទ គ្រាប់បាល់/គ្រាប់ ឬ អំពូល",["다마 나갔어"],"Ambiguous. Use surrounding nouns: light=bulb, bearing=ball, product=bead.","low",true],
  ["SL045","도비",["도비","중량물 운반","기계 설치 운반"],"site_slang","high","무거운 기계나 설비를 옮기고 설치하는 작업 또는 작업자를 뜻합니다.","중량물 운반/설치 작업","vận chuyển/lắp đặt vật nặng hoặc máy móc","งานขนย้าย/ติดตั้งของหนักหรือเครื่องจักร","pekerjaan pemindahan/pemasangan barang berat","भारी सामान/मेसिन सार्ने वा जडान गर्ने काम","ការដឹកជញ្ជូន/ដំឡើងវត្ថុធ្ងន់ ឬ ម៉ាស៊ីន",["도비작업","도비 불러"],"Translate as heavy equipment moving/rigging. Include lifting hazard.","medium",true],
  ["SL046","양중",["양중","리프팅","들어올림"],"construction_logistics","critical","크레인, 지게차 등으로 물건을 들어 올기는 작업입니다.","들어 올림 작업","nâng hạ vật nặng","การยกของ","pengangkatan barang","सामान उचाल्ने काम","ការលើកទំនិញ",["양중해","양중 작업"],"Translate as lifting/hoisting. Safety-critical; preserve exclusion-zone meaning.","high",false],
  ["SL047","걸다",["걸다","안전고리 걸다","줄 걸다","훅 걸다"],"site_slang","high","문맥에 따라 안전고리, 줄, 훅 등을 연결하거나 걸어 고정하는 지시입니다.","연결하거나 고정하다","móc hoặc cố định","เกี่ยวหรือล็อกให้แน่น","mengaitkan atau mengunci","अड्काउने वा सुरक्षित गर्ने","ភ្ជាប់ ឬ ទាក់ឱ្យជាប់",["걸어","걸었어"],"Use context: safety harness=clip on, crane hook=hook, rope=attach.","medium",true],
  ["SL048","풀다",["풀다","해체하다","고정 해제","묶음 해제"],"site_slang","high","묶음, 고정, 체결을 해제하는 지시입니다.","고정을 해제하다","tháo hoặc nới ra","ถอดหรือคลายออก","melepas atau mengendurkan","खोल्नु वा खुकुलो पार्नु","ដោះ ឬ បន្ធូរ",["풀어","풀었어"],"Use context: bolts, straps, ropes, supports. If load is suspended, warn before releasing.","medium",true],
  ["SL049","따다",["따다","구멍따다","전선따다","라인따다"],"site_slang","normal","문맥에 따라 구멍을 내거나, 전선/배관/라인을 분기한다는 표현입니다.","구멍을 내거나 분기하다","khoan lỗ hoặc tách nhánh đường dây/ống","เจาะรูหรือแยกสาย/ท่อ","membuat lubang atau mengambil cabang jalur","प्वाल बनाउनु वा लाइन छुट्याउनु","ធ្វើរន្ធ ឬ បំបែកខ្សែ/បំពង់",["따줘","따놔"],"Highly context dependent. Electrical context requires qualified-worker warning.","medium_low",true],
  ["SL050","빼다",["빼","빼다","분리","제거"],"site_slang","high","물건을 꺼내거나 제거하거나 분리하라는 지시입니다.","제거하거나 분리하다","lấy ra hoặc tháo ra","เอาออกหรือถอดออก","mengeluarkan atau melepas","निकाल्नु वा हटाउनु","ដកចេញ ឬ ដោះចេញ",["빼","빼놔"],"If machine is running, translate with stop-machine warning. Avoid vague remove if object is unsafe.","high",false]
].map(([id, canonical_ko, variants_ko, domain, risk_level, plain_ko, translate_as_ko, vi, th, indonesian, ne, km, asr_corrections, translation_rule, confidence, needs_field_review]) => ({
  id,
  canonical_ko,
  variants_ko,
  domain,
  risk_level,
  plain_ko,
  translate_as_ko,
  translations: { vi, th, id: indonesian, ne, km },
  asr_corrections,
  translation_rule,
  confidence,
  needs_field_review
}));

const scenarios = [
  ["SS001","construction","high","데스라 먼저 설치하고 올라가세요.","난간 또는 가드레일을 먼저 설치한 뒤 올라가세요.",["SL001"],"추락 방지 맥락에서는 데스라를 가드레일로 번역"],
  ["SS002","construction","high","데스리 없는 쪽으로 가지 마세요.","난간이 없는 쪽으로 가지 마세요.",["SL001"],"없는 쪽/가까이 가지 말라는 금지 지시"],
  ["SS003","construction","normal","스미마끼 끝나면 철근 배근 시작하세요.","기준선 표시가 끝나면 철근 배근을 시작하세요.",["SL002"],"스미마끼를 layout marking으로 번역"],
  ["SS004","construction","normal","먹 놓은 선 밖으로 나가면 안 됩니다.","먹줄로 표시한 기준선 밖으로 나가면 안 됩니다.",["SL037"],"먹놓다와 스미마끼를 같은 계열로 연결"],
  ["SS005","construction","normal","바닥 나라시 다시 해 주세요.","바닥 면을 다시 평평하게 고르세요.",["SL003"],"나라시를 leveling/smoothing으로 번역"],
  ["SS006","construction","normal","콘크리트 타설 후 나라시 잘 봐 주세요.","콘크리트를 부은 뒤 표면 평탄화를 잘 확인하세요.",["SL003","SL017"],"콘크리트 문맥"],
  ["SS007","construction","high","거푸집 바라시할 때 밑에 사람 있는지 확인하세요.","거푸집 해체 전에 아래에 사람이 있는지 확인하세요.",["SL004"],"해체 작업 안전"],
  ["SS008","construction","high","비계 바라시 중에는 접근하지 마세요.","비계 해체 중에는 가까이 가지 마세요.",["SL004","SL007"],"해체와 접근금지"],
  ["SS009","construction","high","하스리 작업이라 보안경과 마스크 꼭 착용하세요.","콘크리트 깨기 작업이니 보안경과 마스크를 반드시 착용하세요.",["SL005"],"분진/비산 위험"],
  ["SS010","construction","high","기리바리 빼기 전에 관리자에게 확인받으세요.","임시 버팀대를 제거하기 전에 관리자 확인을 받으세요.",["SL006","SL050"],"구조 지지 해제 위험"],
  ["SS011","construction","critical","아시바 위에서는 안전대를 걸고 작업하세요.","비계 위에서는 안전대를 연결하고 작업하세요.",["SL007","SL047"],"비계+안전대"],
  ["SS012","general","normal","오야지한테 먼저 보고하고 시작하세요.","현장 반장에게 먼저 보고하고 시작하세요.",["SL008"],"비공식 호칭을 중립 번역"],
  ["SS013","general","normal","데모도 한 명 더 붙여 주세요.","보조 작업자 한 명을 더 배치해 주세요.",["SL009"],"비하감 없이 helper로 번역"],
  ["SS014","construction","high","곰방할 때 허리 조심하고 둘이 들어요.","인력 운반할 때 허리를 조심하고 두 사람이 함께 드세요.",["SL010"],"중량물 수작업"],
  ["SS015","general","normal","작업 전에 단도리부터 하세요.","작업 전에 준비부터 하세요.",["SL011"],"준비/세팅"],
  ["SS016","general","normal","오늘은 여기까지 시마이합시다.","오늘은 여기까지 작업을 마무리합시다.",["SL012"],"작업 종료"],
  ["SS017","construction","normal","치수에 유도리 조금 주세요.","치수에 약간의 여유를 주세요.",["SL013"],"허용오차/여유"],
  ["SS018","logistics","high","구루마에 너무 많이 싣지 마세요.","손수레에 물건을 너무 많이 싣지 마세요.",["SL014"],"운반 안전"],
  ["SS019","construction","high","빠루 쓸 때 손 끼임 조심하세요.","쇠지렛대를 사용할 때 손이 끼이지 않게 조심하세요.",["SL015"],"공구 사용 위험"],
  ["SS020","logistics","high","빠렛트 깨진 건 쓰지 마세요.","깨진 팔레트는 사용하지 마세요.",["SL016"],"팔레트 안전"],
  ["SS021","construction","normal","오후에 공구리 칩니다.","오후에 콘크리트를 타설합니다.",["SL017"],"콘크리트 타설"],
  ["SS022","construction","normal","타일 메지 간격 맞춰 주세요.","타일 줄눈 간격을 맞춰 주세요.",["SL018"],"줄눈 간격"],
  ["SS023","construction","normal","화장실 바닥 고바이 잘 잡아야 합니다.","화장실 바닥의 배수 경사를 잘 맞춰야 합니다.",["SL019","SL035"],"배수 구배"],
  ["SS024","construction","normal","다데 방향으로 먼저 붙이세요.","세로 방향으로 먼저 붙이세요.",["SL020"],"방향 지시"],
  ["SS025","construction","normal","요코 방향은 나중에 맞춥니다.","가로 방향은 나중에 맞춥니다.",["SL021"],"방향 지시"],
  ["SS026","construction","high","하리 밑에 서 있지 마세요.","보 아래에 서 있지 마세요.",["SL022"],"구조물 하부 위험"],
  ["SS027","construction","high","기소 작업 구역에는 안전화 신고 들어가세요.","기초 작업 구역에는 안전화를 신고 들어가세요.",["SL023"],"기초 작업"],
  ["SS028","manufacturing","normal","가다대로 맞춰서 잘라 주세요.","기준 틀에 맞춰서 잘라 주세요.",["SL024"],"template/form ambiguity"],
  ["SS029","quality","normal","기스 난 제품은 따로 빼세요.","긁힌 제품은 따로 분리하세요.",["SL025","SL050"],"품질 결함"],
  ["SS030","general","normal","오늘 인원 빵꾸 났습니다.","오늘 필요한 인원이 부족합니다.",["SL026"],"인원 누락 맥락"],
  ["SS031","quality","normal","불량 나면 빠꾸됩니다.","불량이 있으면 반품 또는 재작업 처리됩니다.",["SL027"],"반품/재작업 맥락"],
  ["SS032","general","normal","내일 오전만 땜빵으로 들어가 주세요.","내일 오전만 임시 대체 인력으로 들어가 주세요.",["SL028"],"대체 투입"],
  ["SS033","general","normal","오늘 이 물량은 야리끼리입니다.","오늘 이 작업량을 끝내면 작업을 마칩니다.",["SL029"],"작업량 완료 후 종료"],
  ["SS034","general","normal","점심은 함바에서 먹습니다.","점심은 현장 식당에서 먹습니다.",["SL030"],"현장 식당"],
  ["SS035","construction","high","배관 자리 아나방 해야 합니다.","배관 위치에 구멍을 뚫어야 합니다.",["SL031"],"천공/코어 작업"],
  ["SS036","construction","normal","이 구멍은 메꾸라로 막아 주세요.","이 구멍은 마개로 막아 주세요.",["SL032"],"막음/마개"],
  ["SS037","construction","high","오함마질할 때 주변 사람 빼세요.","대형 망치를 사용할 때 주변 사람을 떨어뜨리세요.",["SL033","SL050"],"타격 위험"],
  ["SS038","construction","high","함마드릴 쓸 때 귀마개 착용하세요.","해머드릴을 사용할 때 귀마개를 착용하세요.",["SL034"],"소음 위험"],
  ["SS039","construction","normal","레벨 보고 다시 나라시 하세요.","수평을 확인하고 다시 평탄화하세요.",["SL036","SL003"],"레벨+평탄화"],
  ["SS040","manufacturing","high","기리 바꿀 때 전원 먼저 내리세요.","드릴 비트를 교체할 때 먼저 전원을 차단하세요.",["SL043"],"기계 교체 안전"],
  ["SS041","maintenance","normal","쪼인트 부분에서 물이 샙니다.","이음부에서 물이 새고 있습니다.",["SL040"],"연결부 누수"],
  ["SS042","construction","normal","벽면 빠데질 끝나면 샌딩하세요.","벽면 퍼티 작업이 끝나면 사포질하세요.",["SL041","SL042"],"마감 작업"],
  ["SS043","rigging","critical","도비 작업 중에는 작업 반경 밖에 있으세요.","중량물 운반/설치 작업 중에는 작업 반경 밖에 있으세요.",["SL045"],"중량물 위험"],
  ["SS044","rigging","critical","양중 중에는 밑으로 지나가지 마세요.","물건을 들어 올리는 중에는 아래로 지나가지 마세요.",["SL046"],"양중 하부 통행 금지"],
  ["SS045","safety","high","안전고리 걸었는지 다시 확인하세요.","안전고리를 연결했는지 다시 확인하세요.",["SL047"],"안전대 연결"],
  ["SS046","rigging","critical","줄 풀기 전에 하중이 걸려 있는지 확인하세요.","줄을 해제하기 전에 무게가 걸려 있는지 확인하세요.",["SL048"],"체결 해제 위험"],
  ["SS047","electrical","critical","전선 따는 작업은 전기 담당자만 하세요.","전선 분기 작업은 전기 담당자만 하세요.",["SL049"],"전기 작업 제한"],
  ["SS048","manufacturing","critical","제품 빼기 전에 기계 멈추세요.","제품을 꺼내기 전에 기계를 멈추세요.",["SL050"],"기계 끼임 위험"]
].map(([id, domain, risk_level, slang_sentence_ko, normalized_ko, term_refs, translation_note]) => ({
  id,
  domain,
  risk_level,
  slang_sentence_ko,
  normalized_ko,
  term_refs,
  translation_note,
  output_channels: risk_level === "critical" ? ["subtitle", "audio", "speaker"] : ["subtitle", "audio"],
  status: "seed_needs_field_review"
}));

const pack = {
  name: "extended_site_slang_translation_pack",
  version: "0.2.0",
  generated_at: new Date().toISOString(),
  status: "seed_needs_field_review",
  sources,
  counts: {
    terms: terms.length,
    scenarios: scenarios.length
  },
  glossary_policy: [
    "Normalize variants and ASR corrections to canonical_ko before translation.",
    "Translate the normalized meaning, not the slang pronunciation.",
    "For low-confidence terms, display an admin review flag and allow field-specific override.",
    "For critical/high risk phrases, preserve the safety action and avoid euphemistic translation."
  ],
  terms,
  scenarios
};

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("|") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const toCsv = (rows, headers) => [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
].join("\n");

const termRows = terms.map((term) => ({
  ...term,
  vi: term.translations.vi,
  th: term.translations.th,
  id_translation: term.translations.id,
  ne: term.translations.ne,
  km: term.translations.km
}));

writeFileSync(join(dataDir, "extended_site_slang_translation_pack.json"), `${JSON.stringify(pack, null, 2)}\n`, "utf8");
writeFileSync(
  join(dataDir, "extended_site_slang_terms_50.csv"),
  `${toCsv(termRows, ["id", "canonical_ko", "variants_ko", "domain", "risk_level", "plain_ko", "translate_as_ko", "vi", "th", "id_translation", "ne", "km", "asr_corrections", "translation_rule", "confidence", "needs_field_review"])}\n`,
  "utf8"
);
writeFileSync(
  join(dataDir, "extended_site_slang_scenarios_48.csv"),
  `${toCsv(scenarios, ["id", "domain", "risk_level", "slang_sentence_ko", "normalized_ko", "term_refs", "translation_note", "output_channels", "status"])}\n`,
  "utf8"
);

console.log(`Wrote ${terms.length} slang terms and ${scenarios.length} slang scenarios`);
