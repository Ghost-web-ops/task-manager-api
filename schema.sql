CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- مسح الجداول القديمة إذا كانت موجودة للبدء من جديد (اختياري)
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS users;

-- =================================================================
-- جدول المستخدمين (Users)
-- يخزن معلومات تسجيل الدخول لكل مستخدم
-- =================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- أصبح اختيارياً ليدعم تسجيل دخول جوجل
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- جدول اللوحات (Boards)
-- كل لوحة تمثل مشروعًا كبيرًا يملكه مستخدم
-- =================================================================
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE -- إذا تم حذف المستخدم، يتم حذف كل لوحاته
);

-- =================================================================
-- جدول القوائم (Lists)
-- كل قائمة تمثل عمودًا (مثل "To Do") داخل لوحة معينة
-- =================================================================
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL, -- ترتيب القائمة داخل اللوحة
    board_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_board
        FOREIGN KEY(board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE -- إذا تم حذف اللوحة، يتم حذف كل قوائمها
);

-- =================================================================
-- جدول البطاقات (Cards)
-- كل بطاقة تمثل مهمة فردية داخل قائمة معينة
-- =================================================================
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL, -- ترتيب البطاقة داخل القائمة
    list_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_list
        FOREIGN KEY(list_id)
        REFERENCES lists(id)
        ON DELETE CASCADE -- إذا تم حذف القائمة، يتم حذف كل بطاقاتها
);