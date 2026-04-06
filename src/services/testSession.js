const TEST_UUID_KEY = "illoflex_test_uuid";

export function saveTestUuid(uuid) {
	sessionStorage.setItem(TEST_UUID_KEY, uuid);
}

export function getTestUuid() {
	return sessionStorage.getItem(TEST_UUID_KEY);
}

export function clearTestUuid() {
	sessionStorage.removeItem(TEST_UUID_KEY);
}
