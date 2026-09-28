docker.containers.ids.each do |id|
  # call Docker inspect for a specific container id
  describe docker.object(id) do
    its(%w(HostConfig Privileged)) { should cmp false }
    its(%w(HostConfig Privileged)) { should_not cmp true }
  end
end