// 触碰两点间距离
    private float spacing(MotionEvent event) {

        float x = 0;
        float y = 0;
        try {
            isBug = false;
            x = event.getX(0) - event.getX(1);
            y = event.getY(0) - event.getY(1);
        }catch (IllegalArgumentException e) {
            isBug = true;
            e.printStackTrace();
        }
        return (float) Math.sqrt(x * x + y * y);
    }

    // 取手势中心点
    private void midPoint(PointF point, MotionEvent event) {
        float x = event.getX(0) + event.getX(1);
        float y = event.getY(0) + event.getY(1);
        point.set(x / 2, y / 2);
    }

    // 取旋转角度
    private float rotation(MotionEvent event) {
        double delta_x;
        double delta_y;
        double radians = 0;
        try {
            delta_x = (event.getX(0) - event.getX(1));
            delta_y = (event.getY(0) - event.getY(1));
            radians = Math.atan2(delta_y, delta_x);
        }catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
        return (float) Math.toDegrees(radians);
    }